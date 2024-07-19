"use client";

import { useEffect } from "react";
import { Signature } from "ethers";
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
// import { deriveEthereumAddress } from "~~/utils/sign-verify-js-sol/chatgpt_address";
import { contract, signer } from "~~/utils/sign-verify-js-sol/ethers_sepolia";

// import { sha256 } from '@noble/hashes/sha256';
// import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

// import EC from "elliptic";  // require('elliptic').ec;
// // import { secp256k1 } from '@noble/curves/secp256k1';
// import BN from "bn.js";  // require('bn.js');
// Apply the Keccak-256 hash function
// import keccak256 from "js-sha3";  // require('js-sha3').keccak256;

// Elliptic Curve used by Ethereum that is secp526k1
// const ec = new EC.ec('secp256k1');
// const SK = new BN('DC38EE117CAE37750EB1ECC5CFD3DE8E85963B481B93E732C5D0CB66EE6B0C9D', 16);

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

      const ADDY = "0x2C80552A6f2FD1b32d7783E4c5086899da3933b8";

      // Our message
      const message = "Hello World";

      // The raw signature; 65 bytes
      const rawSig = await signer.signMessage(message);
      console.log("rawSig ::: ", rawSig);
      // '0xa617d0558818c7a479d5063987981b59d6e619332ef52249be8243572ef1086807e381afe644d9bb56b213f6e08374c893db308ac1a5ae2bf8b33bcddcb0f76a1b'

      // Converting it to a Signature object provides more
      // flexibility, such as using it as a struct
      const sig = Signature.from(rawSig);
      // Signature { r: "0xa617d0558818c7a479d5063987981b59d6e619332ef52249be8243572ef10868", s: "0x07e381afe644d9bb56b213f6e08374c893db308ac1a5ae2bf8b33bcddcb0f76a", yParity: 0, networkV: null }

      // If the signature matches the EIP-2098 format, a Signature
      // can be passed as the struct value directly, since the
      // parser will pull out the matching struct keys from sig.
      console.log("recoverStringFromCompact(message, sig) ::: ", await contract.recoverStringFromCompact(message, sig));
      // '0x0A489345F9E9bc5254E18dd14fA7ECfDB2cE5f21'

      // Likewise, if the struct keys match an expanded signature
      // struct, it can also be passed as the struct value directly.
      console.log("recoverStringFromExpanded(message, sig)", await contract.recoverStringFromExpanded(message, sig));
      // '0x0A489345F9E9bc5254E18dd14fA7ECfDB2cE5f21'

      // If using an older API which requires the v, r and s be passed
      // separately, those members are present on the Signature.
      console.log(
        "recoverStringFromVRS(message, sig.v, sig.r, sig.s)",
        await contract.recoverStringFromVRS(message, sig.v, sig.r, sig.s),
      );
      // '0x0A489345F9E9bc5254E18dd14fA7ECfDB2cE5f21'

      // Or if using an API that expects a raw signature.
      console.log("recoverStringFromRaw(message, rawSig)", await contract.recoverStringFromRaw(message, rawSig));
      // '0x0A489345F9E9bc5254E18dd14fA7ECfDB2cE5f21'

      // Derive the Ethereum address
      // const ethereumAddress = deriveEthereumAddress();
      // console.log("Derived Ethereum Address:", ethereumAddress);
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
          name: "_admin",
          type: "address",
        },
        {
          internalType: "address",
          name: "_publicAddy",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [],
      name: "OnlyAdmin",
      type: "error",
    },
    {
      inputs: [],
      name: "OnlyApp",
      type: "error",
    },
    {
      inputs: [],
      name: "PhotoNotFound",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "photoHash",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "PhotoRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "_photoHash",
          type: "string",
        },
        {
          indexed: false,
          internalType: "address",
          name: "requester",
          type: "address",
        },
      ],
      name: "PhotoVerified",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "publicAddy",
          type: "address",
        },
      ],
      name: "PublicAddy",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "previousAdminRole",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "newAdminRole",
          type: "bytes32",
        },
      ],
      name: "RoleAdminChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleGranted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleRevoked",
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
      inputs: [],
      name: "APP_BANNED",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "APP_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
      ],
      name: "getRoleAdmin",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "hasRole",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "hash",
          type: "bytes32",
        },
        {
          components: [
            {
              internalType: "bytes32",
              name: "r",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "yParityAndS",
              type: "bytes32",
            },
          ],
          internalType: "struct RecoverMessage.SignatureCompact",
          name: "sig",
          type: "tuple",
        },
      ],
      name: "recoverHashFromCompact",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "message",
          type: "string",
        },
        {
          components: [
            {
              internalType: "bytes32",
              name: "r",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "yParityAndS",
              type: "bytes32",
            },
          ],
          internalType: "struct RecoverMessage.SignatureCompact",
          name: "sig",
          type: "tuple",
        },
      ],
      name: "recoverStringFromCompact",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "message",
          type: "string",
        },
        {
          components: [
            {
              internalType: "uint8",
              name: "v",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "r",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
            },
          ],
          internalType: "struct RecoverMessage.SignatureExpanded",
          name: "sig",
          type: "tuple",
        },
      ],
      name: "recoverStringFromExpanded",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "message",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "sig",
          type: "bytes",
        },
      ],
      name: "recoverStringFromRaw",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "message",
          type: "string",
        },
        {
          internalType: "uint8",
          name: "v",
          type: "uint8",
        },
        {
          internalType: "bytes32",
          name: "r",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "s",
          type: "bytes32",
        },
      ],
      name: "recoverStringFromVRS",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "pure",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_wallet",
          type: "address",
        },
        {
          components: [
            {
              internalType: "string",
              name: "photoIpfsHash",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "pinTime",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "pinSize",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "rawSig",
              type: "bytes",
            },
            {
              internalType: "uint256",
              name: "timestamp",
              type: "uint256",
            },
          ],
          internalType: "struct SiPPP.TransactionData",
          name: "_sipppTxn",
          type: "tuple",
        },
      ],
      name: "registerPhoto",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_publicAddy",
          type: "address",
        },
      ],
      name: "updatePubAddy",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "userPhotos",
      outputs: [
        {
          internalType: "string",
          name: "photoIpfsHash",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "pinTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "pinSize",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "rawSig",
          type: "bytes",
        },
        {
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "message",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "rawSig",
          type: "bytes",
        },
      ],
      name: "verifyApp",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_wallet",
          type: "address",
        },
        {
          internalType: "string",
          name: "_photoIpfsHash",
          type: "string",
        },
      ],
      name: "verifyPhotoProvenance",
      outputs: [
        {
          internalType: "bool",
          name: "",
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
      data: "0x0000000000000000000000000000000000000000000000000000000000000001",
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
