import { Contract, Wallet, InfuraProvider, id } from "ethers";

// The contract below is deployed to Sepolia at this address
const contractAddress = "0xf554DA5e35b2e40C09DDB481545A395da1736513";
export const contract = new Contract(contractAddress, [
  "function recoverStringFromCompact(string message, (bytes32 r, bytes32 yParityAndS) sig) pure returns (address)",
  "function recoverStringFromExpanded(string message, (uint8 v, bytes32 r, bytes32 s) sig) pure returns (address)",
  "function recoverStringFromVRS(string message, uint8 v, bytes32 r, bytes32 s) pure returns (address)",
  "function recoverStringFromRaw(string message, bytes sig) pure returns (address)",
  "function recoverHashFromCompact(bytes32 hash, (bytes32 r, bytes32 yParityAndS) sig) pure returns (address)"
], new InfuraProvider("sepolia"));

// The Signer; it does not need to be connected to a Provider to sign
export const signer = new Wallet(process.env.SIPPP_APP_KEY);// id("SiPPP"));
signer.address
// '0x0A489345F9E9bc5254E18dd14fA7ECfDB2cE5f21'

// // Our message
// message = "Hello World";

// // The raw signature; 65 bytes
// rawSig = await signer.signMessage(message);
// // '0xa617d0558818c7a479d5063987981b59d6e619332ef52249be8243572ef1086807e381afe644d9bb56b213f6e08374c893db308ac1a5ae2bf8b33bcddcb0f76a1b'

// // Converting it to a Signature object provides more
// // flexibility, such as using it as a struct
// sig = ethers.Signature.from(rawSig);
// // Signature { r: "0xa617d0558818c7a479d5063987981b59d6e619332ef52249be8243572ef10868", s: "0x07e381afe644d9bb56b213f6e08374c893db308ac1a5ae2bf8b33bcddcb0f76a", yParity: 0, networkV: null }


// // If the signature matches the EIP-2098 format, a Signature
// // can be passed as the struct value directly, since the
// // parser will pull out the matching struct keys from sig.
// await contract.recoverStringFromCompact(message, sig);
// // '0x0A489345F9E9bc5254E18dd14fA7ECfDB2cE5f21'

// // Likewise, if the struct keys match an expanded signature
// // struct, it can also be passed as the struct value directly.
// await contract.recoverStringFromExpanded(message, sig);
// // '0x0A489345F9E9bc5254E18dd14fA7ECfDB2cE5f21'

// // If using an older API which requires the v, r and s be passed
// // separately, those members are present on the Signature.
// await contract.recoverStringFromVRS(message, sig.v, sig.r, sig.s);
// // '0x0A489345F9E9bc5254E18dd14fA7ECfDB2cE5f21'

// // Or if using an API that expects a raw signature.
// await contract.recoverStringFromRaw(message, rawSig);
// // '0x0A489345F9E9bc5254E18dd14fA7ECfDB2cE5f21'

// Note: The above recovered addresses matches the signer address