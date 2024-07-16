"use client";

import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { decodeEventLog } from "viem";
import { BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { ContractUI } from "~~/app/debug/_components/contract";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getAllContracts } from "~~/utils/scaffold-eth/contractsData";
//   createWalletClient,
//   custom,
//   Hex,
//   verifyMessage,
//   recoverPublicKey,
//   recoverAddress,
//   recoverMessageAddress,
// hashMessage } from 'viem';
// import { privateKeyToAccount } from 'viem/accounts';
// import { hexToUint8Array, uint8ArrayToHex } from 'uint8array-extras';
// import { ed25519ctx, ed25519ph } from '@noble/curves/ed25519'; // Variants from RFC8032: with context, prehashed
// import { ed25519 } from '@noble/curves/ed25519';
// import { x25519 } from '@noble/curves/ed25519'; // ECDH using curve25519 aka x25519
// import { edwardsToMontgomeryPub, edwardsToMontgomeryPriv } from '@noble/curves/ed25519'; // ed25519 => x25519 conversion
// import { testEd25519 } from '../../components/sign/ed25519';
// import { getAppPubKey, getAppAddress, appSign } from "~~/utils/sign-verify-js-sol/secp256k1";
// import { signMessageWithPrivateKey } from "~~/utils/sign-verify-js-sol/chatgpt";
import { deriveEthereumAddress } from "~~/utils/sign-verify-js-sol/chatgpt_address";

// import { sha256 } from '@noble/hashes/sha256';
// import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

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
    (async () => {
      console.log(" ");
      console.log(" ::: TESTING Secp256k1 ::: ");
      console.log(" ");

      // const ADDY = '0x2C80552A6f2FD1b32d7783E4c5086899da3933b8'
      const ADDY = "0x2C80552A6f2FD1b32d7783E4c5086899da3933b8";

      // Derive the Ethereum address
      const ethereumAddress = deriveEthereumAddress();
      console.log("Derived Ethereum Address:", ethereumAddress);
      console.log("Expected Ethereum Address:", ADDY);

      // const { messageHash, signature, signerAddress } = await signMessageWithPrivateKey();

      // console.log('CHAT GPT OUT ::',{
      //   messageHash,
      //   signature,
      //   signerAddress
      // });

      // const SIPPP_PUBKEY = getAppPubKey();
      // const SIPPP_ADDY = getAppAddress();

      // // Hash the message
      // const messageHash = sha256('hello world');
      // // Pad the message hash to bytes32
      // const messageHashBuffer = Buffer.alloc(32);
      // Buffer.from(messageHash).copy(messageHashBuffer);
      // // Sign the message hash
      // const signature = await appSign(messageHash);

      // console.log('SIPPP_PUBKEY ::: ', bytesToHex(SIPPP_PUBKEY))
      // console.log('SIPPP_ADDY ::::: ', SIPPP_ADDY)
      // console.log('EXPECTED ADDY :: ', ADDY)
      // console.log('SIGNATURE :::::: ', signature)
      // console.log('MESSAGE HASH :: ', messageHash)

      console.log(" ");
      console.log(" ::: TESTING Secp256k1 ::: ");
      console.log(" ");
    })();

    // console.log(" ::: TESTING VIEM ::: ");
    // console.log(" ");
    // (async () => {
    //   const account = privateKeyToAccount(process.env.SIPPP_APP_KEY as Hex);
    //   console.log('account: ', account.address)
    //   const walletClient = createWalletClient({
    //     account,
    //     transport: custom(window.ethereum),
    //   });

    //   const msgString = 'hello world';
    //   const encoder = /*#__PURE__*/ new TextEncoder();
    //   const hashedMsg = hashMessage(msgString);
    //   const bytesMsg = encoder.encode(msgString);
    //   console.log('HASHED MESSAGE :: ', hashedMsg)
    //   console.log('BYTES MESSAGE  :: ', bytesMsg)

    //   const signature = await walletClient.signMessage({
    //     message: hashedMsg,
    //   });
    //   console.log('SIGNATURE :: ', signature)

    //   const sigPubKey = await recoverPublicKey({
    //     hash: hashedMsg,
    //     signature: signature
    //   })
    //   console.log('SIGNATURE PUB KEY :: ', sigPubKey)

    //   const sigAddy = await recoverAddress({
    //     hash: hashedMsg,
    //     signature: signature
    //   })
    //   console.log('SIGNATURE ADDRESS :: ', sigAddy)

    //   const sigMsgAddy = await recoverMessageAddress({
    //     message: hashedMsg,
    //     signature: signature
    //   })
    //   console.log('SIGNATURE MESSAGE ADDRESS :: ', sigMsgAddy)

    //   const valid = await verifyMessage({
    //     address: account.address,
    //     message: 'hello world',
    //     signature,
    //   });
    //   console.log('VALID :: ', valid)
    // })();
    // console.log(" ");
    // console.log(" ::: TESTING VIEM ::: ");
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

  console.log(
    "Decode 1 :: ",
    decodeEventLog({
      abi: abi,
      data: "0x00000000000000000000000080ea7d2dea8e24e6b35f0905876291f899bd7898",
      topics: ["0xc29520202fe1293cbc2929e930636f727421bdc994cd11a6265c784faa238875"],
    }),
  );

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
