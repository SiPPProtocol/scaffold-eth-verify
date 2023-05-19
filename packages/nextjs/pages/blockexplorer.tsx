import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BlockWithTransactions, TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";

// --DONE--: Use pages instead of showing the last 10 transactions
// TODO: http://localhost:3000/blockexplorer/address/0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 or http://localhost:3000/address/0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 ?
// TODO: Add a search bar
// --DONE--: Make the addresses copiable

const Blockexplorer: NextPage = () => {
  const [blocks, setBlocks] = useState<BlockWithTransactions[]>([]);
  const [transactionReceipts, setTransactionReceipts] = useState<{
    [key: string]: ethers.providers.TransactionReceipt;
  }>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const blocksPerPage = 10;

  const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

  const fetchBlocks = async () => {
    const blockNumber = await provider.getBlockNumber();
    setTotalBlocks(blockNumber);
    const blocks: BlockWithTransactions[] = [];
    const receipts: { [key: string]: ethers.providers.TransactionReceipt } = {};

    const startingBlock = blockNumber - currentPage * blocksPerPage;
    for (let i = 0; i < blocksPerPage; i++) {
      const blockNumberToFetch = startingBlock - i;
      if (blockNumberToFetch < 0) {
        break;
      }

      const block = await provider.getBlockWithTransactions(blockNumberToFetch);
      blocks.push(block);

      for (const tx of block.transactions) {
        const receipt = await provider.getTransactionReceipt(tx.hash);
        receipts[tx.hash] = receipt;
      }
    }

    setBlocks(blocks);
    setTransactionReceipts(receipts);
  };

  useEffect(() => {
    fetchBlocks();
  }, [currentPage]);

  useEffect(() => {
    provider.on("block", async blockNumber => {
      const newBlock = await provider.getBlockWithTransactions(blockNumber);

      if (!blocks.some(block => block.number === newBlock.number)) {
        // Only update if we're on the first page.
        if (currentPage === 0) {
          setBlocks(prevBlocks => [newBlock, ...prevBlocks.slice(0, blocksPerPage - 1)]);

          for (const tx of newBlock.transactions) {
            const receipt = await provider.getTransactionReceipt(tx.hash);
            setTransactionReceipts(prevReceipts => ({
              ...prevReceipts,
              [tx.hash]: receipt,
            }));
          }
        }

        // Update the total number of blocks.
        setTotalBlocks(blockNumber + 1);
      }
    });

    return () => {
      provider.off("block");
    };
  }, [blocks, currentPage]);

  return (
    <div className="m-10">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border-2 border-gray-200 shadow-md overflow-hidden rounded-lg">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-2">Transaction Hash</th>
              <th className="px-4 py-2">Function Called</th>
              <th className="px-4 py-2">Block Number</th>
              <th className="px-4 py-2">Time Mined</th>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Value (ETH)</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(blocks.reduce((map, block) => map.set(block.hash, block), new Map()).values()).map(block =>
              block.transactions.map((tx: TransactionResponse) => {
                const receipt = transactionReceipts[tx.hash];

                const shortTxHash = `${tx.hash.substring(0, 6)}...${tx.hash.substring(tx.hash.length - 4)}`;
                const date = new Date(block.timestamp * 1000);
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                const timeMined = `${month}/${day} ${date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}`;
                const functionCalled = tx.data.substring(0, 10);

                return (
                  <tr key={tx.hash}>
                    <td className="border px-4 py-2">
                      <Link className="text-blue-500 underline" href={`/transaction/${tx.hash}`}>
                        {shortTxHash}
                      </Link>
                    </td>
                    <td className="border px-4 py-2">{functionCalled === "0x" ? "" : functionCalled}</td>
                    <td className="border px-4 py-2 w-20">{block.number}</td>
                    <td className="border px-4 py-2">{timeMined}</td>
                    <td className="border px-4 py-2">
                      <Address address={tx.from} />
                    </td>
                    <td className="border px-4 py-2">
                      {!receipt?.contractAddress ? (
                        tx.to && <Address address={tx.to} />
                      ) : (
                        <span>
                          Contract Creation:
                          <Address address={receipt.contractAddress} />
                        </span>
                      )}
                    </td>
                    <td className="border px-4 py-2">{ethers.utils.formatEther(tx.value)} ETH</td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-5">
        <button
          className={`btn btn-secondary btn-sm  ${
            currentPage === 0 ? "bg-gray-200 cursor-default" : "bg-blue-500 text-white"
          }`}
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          {"<"}
        </button>
        <span className="mr-2 ml-2 self-center">Page {currentPage + 1}</span>
        <button
          className={`btn btn-secondary btn-sm  ${
            (currentPage + 1) * blocksPerPage >= totalBlocks ? "bg-gray-200 cursor-default" : "bg-blue-500 text-white"
          }`}
          disabled={(currentPage + 1) * blocksPerPage >= totalBlocks}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default Blockexplorer;
