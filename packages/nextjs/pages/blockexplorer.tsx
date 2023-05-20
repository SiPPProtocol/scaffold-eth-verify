import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BlockWithTransactions, TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import deployedContracts from "~~/generated/deployedContracts";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

// TODO: Add OPCODES and maybe STORAGE for contracts
// TODO: Better pagination(some pages have less than BLOCKS_PER_PAGE blocks)
// TODO: Refactor, seperate the table to a component
// TODO: Don't do everything in a loop... Please...
// TODO: try useMemo to avoid unnecessary re-renders
// TODO: Error handling for API calls
// TODO: Use react-query
// TODO: Add tests

type TransactionWithFunction = TransactionResponse & { functionName?: string };

const BLOCKS_PER_PAGE = 20;

const Blockexplorer: NextPage = () => {
  const [blocks, setBlocks] = useState<BlockWithTransactions[]>([]);
  const [transactionReceipts, setTransactionReceipts] = useState<{
    [key: string]: ethers.providers.TransactionReceipt;
  }>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchedBlock, setSearchedBlock] = useState<BlockWithTransactions | null>(null);
  const [searchedTransaction, setSearchedTransaction] = useState<TransactionWithFunction | null>(null);
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null);
  const configuredNetwork = getTargetNetwork();

  const router = useRouter();

  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

  const fetchBlocks = async () => {
    const blockNumber = await provider.getBlockNumber();
    setTotalBlocks(blockNumber);
    const blocks: BlockWithTransactions[] = [];
    const receipts: { [key: string]: ethers.providers.TransactionReceipt } = {};
    const startingBlock = blockNumber - currentPage * BLOCKS_PER_PAGE;

    for (let i = 0; i < BLOCKS_PER_PAGE; i++) {
      const blockNumberToFetch = startingBlock - i;
      if (blockNumberToFetch < 0) {
        break;
      }

      const block = (await provider.getBlockWithTransactions(blockNumberToFetch)) as BlockWithTransactions & {
        transactions: TransactionWithFunction[];
      };

      blocks.push(block);

      const chain = deployedContracts[31337][0];
      const interfaces: { [contractName: string]: ethers.utils.Interface } = {};

      for (const [contractName, contract] of Object.entries(chain.contracts)) {
        interfaces[contractName] = new ethers.utils.Interface(contract.abi);
      }

      for (const tx of block.transactions as TransactionWithFunction[]) {
        const receipt = await provider.getTransactionReceipt(tx.hash);
        receipts[tx.hash] = receipt;

        if (tx.data.length >= 10 && !tx.data.startsWith("0x60a06040")) {
          for (const [contractName, contractInterface] of Object.entries(interfaces)) {
            try {
              const decodedData = contractInterface.parseTransaction({ data: tx.data });
              tx.functionName = `${contractName}: ${decodedData.name}`;
              break;
            } catch (e) {
              console.log(`Parsing failed for contract ${contractName}: ${e}`);
            }
          }
        }
      }
    }

    setBlocks(blocks);
    setTransactionReceipts(receipts);
  };

  const handleSearch = async () => {
    setSearchedBlock(null);
    setSearchedTransaction(null);
    setSearchedAddress(null);

    if (ethers.utils.isHexString(searchInput)) {
      try {
        const tx = await provider.getTransaction(searchInput);
        if (tx) {
          router.push(`/transaction/${searchInput}`);
          return;
        }
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
      }
    }

    if (ethers.utils.isAddress(searchInput)) {
      router.push(`/address/${searchInput}`);
      return;
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, [currentPage]);

  useEffect(() => {
    provider.on("block", async blockNumber => {
      const newBlock = await provider.getBlockWithTransactions(blockNumber);

      if (!blocks.some(block => block.number === newBlock.number)) {
        if (currentPage === 0) {
          setBlocks(prevBlocks => [newBlock, ...prevBlocks.slice(0, BLOCKS_PER_PAGE - 1)]);

          for (const tx of newBlock.transactions) {
            const receipt = await provider.getTransactionReceipt(tx.hash);
            setTransactionReceipts(prevReceipts => ({
              ...prevReceipts,
              [tx.hash]: receipt,
            }));
          }
        }
        setTotalBlocks(blockNumber + 1);
      }
    });

    return () => {
      provider.off("block");
    };
  }, [blocks, currentPage]);

  return (
    <div className="m-10 mb-20">
      <div className="flex justify-end mb-5">
        <input
          type="text"
          className="border-primary bg-base-100 text-base-content p-2 mr-2 w-full md:w-1/2 lg:w-1/3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Search by hash or address"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value.trim())}
        />
        <button
          className="btn bg-primary text-primary-content hover:bg-accent hover:text-accent-content shadow-md transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {searchedBlock && (
        <div className="mb-5 bg-neutral p-3 rounded-lg shadow-md">
          <h2 className="mb-2 text-primary">Searched Block: {searchedBlock.number}</h2>
          <ul className="list-disc pl-5 text-neutral-content">
            {searchedBlock.transactions.map((tx, index) => (
              <li key={index}>{tx.hash}</li>
            ))}
          </ul>
        </div>
      )}
      {searchedTransaction && (
        <div className="mb-5 bg-neutral p-3 rounded-lg shadow-md">
          <h2 className="mb-2 text-primary">Searched Transaction: {searchedTransaction.hash}</h2>
          <p className="text-neutral-content">From: {searchedTransaction.from}</p>
          <p className="text-neutral-content">To: {searchedTransaction.to}</p>
          <p className="text-neutral-content">
            Value: {ethers.utils.formatEther(searchedTransaction.value)} {configuredNetwork.nativeCurrency.symbol}
          </p>
        </div>
      )}
      {searchedAddress && (
        <div className="mb-5 bg-neutral p-3 rounded-lg shadow-md">
          <h2 className="mb-2 text-primary">Searched Address: {searchedAddress}</h2>
          <p className="text-neutral-content">Transactions related to this address:</p>
          <ul className="list-disc pl-5 text-neutral-content">
            {blocks
              .flatMap(block => block.transactions)
              .filter(tx => tx.from === searchedAddress || tx.to === searchedAddress)
              .map(tx => (
                <li key={tx.hash}>{tx.hash}</li>
              ))}
          </ul>
        </div>
      )}
      <div className="overflow-x-auto shadow-lg">
        <table className="min-w-full divide-y divide-primary shadow-lg rounded-lg bg-neutral">
          <thead className="bg-primary">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-primary-content uppercase tracking-wider"
              >
                Transaction Hash
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-primary-content uppercase tracking-wider"
              >
                Function Called
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-primary-content uppercase tracking-wider"
              >
                Block Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-primary-content uppercase tracking-wider"
              >
                Time Mined
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-primary-content uppercase tracking-wider"
              >
                From
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-primary-content uppercase tracking-wider"
              >
                To
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-primary-content uppercase tracking-wider"
              >
                Value ({configuredNetwork.nativeCurrency.symbol})
              </th>
            </tr>
          </thead>
          <tbody className="bg-base-100 divide-y divide-primary-content text-base-content">
            {Array.from(blocks.reduce((map, block) => map.set(block.hash, block), new Map()).values()).map(block =>
              block.transactions.map((tx: TransactionWithFunction) => {
                const receipt = transactionReceipts[tx.hash];

                const shortTxHash = `${tx.hash.substring(0, 6)}...${tx.hash.substring(tx.hash.length - 4)}`;
                const timeMined = new Date(block.timestamp * 1000).toLocaleString();
                const functionCalled = tx.data.substring(0, 10);

                return (
                  <tr key={tx.hash} className="bg-base-200 hover:bg-base-300 transition-colors duration-200">
                    <td className="border px-4 py-2 text-base-content">
                      <Link className="text-base-content hover:text-accent-focus" href={`/transaction/${tx.hash}`}>
                        {shortTxHash}
                      </Link>
                    </td>

                    <td className="border px-4 py-2 w-full md:w-1/2 lg:w-1/5 text-base-content">
                      {tx.functionName === "0x" ? "" : tx.functionName}
                      {functionCalled !== "0x" && (
                        <span className="ml-2 inline-block rounded-full px-3 py-1 text-sm font-semibold text-primary-content bg-accent">
                          {functionCalled}
                        </span>
                      )}
                    </td>
                    <td className="border px-4 py-2 w-20 text-base-content">{block.number}</td>
                    <td className="border px-4 py-2 text-base-content">{timeMined}</td>
                    <td className="border px-4 py-2 text-base-content">
                      <Address address={tx.from} />
                    </td>
                    <td className="border px-4 py-2 text-base-content">
                      {!receipt?.contractAddress ? (
                        tx.to && <Address address={tx.to} />
                      ) : (
                        <span>
                          Contract Creation:
                          <Address address={receipt.contractAddress} />
                        </span>
                      )}
                    </td>
                    <td className="border px-4 py-2 text-base-content">
                      {ethers.utils.formatEther(tx.value)} {configuredNetwork.nativeCurrency.symbol}
                    </td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
      <div className="absolute right-0 bottom-0 mb-5 mr-5 flex space-x-3">
        <button
          className={`btn py-1 px-3 rounded-md text-xs ${
            currentPage === 0
              ? "bg-gray-200 cursor-default"
              : "bg-primary text-primary-content hover:bg-accent hover:text-accent-content"
          }`}
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <span className="self-center text-primary-content font-medium">Page {currentPage + 1}</span>
        <button
          className={`btn py-1 px-3 rounded-md text-xs ${
            currentPage + 1 >= totalBlocks
              ? "bg-gray-200 cursor-default"
              : "bg-primary text-primary-content hover:bg-accent hover:text-accent-content"
          }`}
          disabled={currentPage + 1 >= Math.ceil(totalBlocks / BLOCKS_PER_PAGE)}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Blockexplorer;
