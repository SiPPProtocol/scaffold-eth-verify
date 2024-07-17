"use client";

import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Hex, createWalletClient, custom, decodeEventLog, recoverMessageAddress, verifyMessage } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { ContractUI } from "~~/app/debug/_components/contract";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";

const selectedContractStorageKey = "scaffoldEth2.selectedContract";
const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData) as ContractName[];

export function DebugContracts() {
  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
    { initializeWithValue: false },
  );

  useEffect(() => {
    console.log(" ::: TESTING VIEM ::: ");
    console.log(" ");
    (async () => {
      const account = privateKeyToAccount(process.env.NEXT_PUBLIC_SIPPP_APP_KEY as Hex);
      console.log("account: ", account.address);
      const walletClient = createWalletClient({
        account,
        transport: custom(window.ethereum),
      });

      // Just send whatever as a string instead of a hex.
      const msgString = "hello world";

      const signature = await walletClient.signMessage({
        message: msgString,
      });
      console.log("SIGNATURE :: ", signature);

      const sigMsgAddy = await recoverMessageAddress({
        message: msgString,
        signature: signature,
      });
      console.log("SIGNATURE MESSAGE ADDRESS :: ", sigMsgAddy);

      const valid = await verifyMessage({
        address: account.address,
        message: msgString,
        signature,
      });
      console.log("VALID :: ", valid);
    })();
    console.log(" ");
    console.log(" ::: TESTING VIEM END ::: ");
  }, []);

  useEffect(() => {
    if (!contractNames.includes(selectedContract)) {
      setSelectedContract(contractNames[0]);
    }
  }, [selectedContract, setSelectedContract]);

  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_publicKey",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "publicKey",
          type: "address",
        },
      ],
      name: "PublicKey",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bool",
          name: "verified",
          type: "bool",
        },
      ],
      name: "Verified",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
        {
          internalType: "bytes",
          name: "signature",
          type: "bytes",
        },
      ],
      name: "verifySignedHashIsSipppSigned",
      outputs: [
        {
          internalType: "bool",
          name: "verified",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  // This prints the address that was derived from the private key.
  console.log(
    "Decode 1 :: ",
    decodeEventLog({
      abi: abi,
      data: "0x00000000000000000000000080ea7d2dea8e24e6b35f0905876291f899bd7898",
      topics: ["0xc29520202fe1293cbc2929e930636f727421bdc994cd11a6265c784faa238875"],
    }),
  );

  // This prints the address that you used as ADDY above.
  console.log(
    "Decode 2 :: ",
    decodeEventLog({
      abi: abi,
      data: "0x0000000000000000000000002c80552a6f2fd1b32d7783e4c5086899da3933b8",
      topics: ["0xc29520202fe1293cbc2929e930636f727421bdc994cd11a6265c784faa238875"],
    }),
  );

  console.log(
    "Answer 1 :: ",
    decodeEventLog({
      abi: abi,
      data: "0x0000000000000000000000000000000000000000000000000000000000000000",
      topics: ["0x31f0cd2056cb14961826087872d64b913fa6118127d4fceade8a9cfe80cce5f5"],
    }),
  );

  return (
    <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
      {contractNames.length === 0 ? (
        <p className="text-3xl mt-14">No contracts found!</p>
      ) : (
        <>
          {contractNames.length > 1 && (
            <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
              {contractNames.map(contractName => (
                <button
                  className={`btn btn-secondary btn-sm font-light hover:border-transparent ${
                    contractName === selectedContract
                      ? "bg-base-300 hover:bg-base-300 no-animation"
                      : "bg-base-100 hover:bg-secondary"
                  }`}
                  key={contractName}
                  onClick={() => setSelectedContract(contractName)}
                >
                  {contractName}
                  {contractsData[contractName].external && (
                    <span className="tooltip tooltip-top tooltip-accent" data-tip="External contract">
                      <BarsArrowUpIcon className="h-4 w-4 cursor-pointer" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          {contractNames.map(contractName => (
            <ContractUI
              key={contractName}
              contractName={contractName}
              className={contractName === selectedContract ? "" : "hidden"}
            />
          ))}
        </>
      )}
    </div>
  );
}
