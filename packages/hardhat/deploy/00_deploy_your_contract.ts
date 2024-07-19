import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// import { Contract } from "ethers";

/**
 * Deploys a contract named "SiPPProvenance" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deploySiPPProvenance: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  // const publicAddy = "0x2C80552A6f2FD1b32d7783E4c5086899da3933b8";
  const { deploy } = hre.deployments;

  await deploy("SiPPP", {
    from: deployer,
    // Contract constructor arguments
    args: ["0x2C80552A6f2FD1b32d7783E4c5086899da3933b8", "0x2C80552A6f2FD1b32d7783E4c5086899da3933b8"],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  // const sippProvenance = await hre.ethers.getContract<Contract>("SiPPProvenance", deployer);
  // console.log("👋 Initial greeting:", await sippProvenance.greeting());
};

export default deploySiPPProvenance;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags SiPPProvenance
deploySiPPProvenance.tags = ["SiPPProvenance"];
