// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("YourContract", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const YourContract = await ethers.getContract("YourContract", deployer);
  /*  await YourContract.setPurpose("Hello");
  
    // To take ownership of yourContract using the ownable library uncomment next line and add the 
    // address you want to be the owner. 
    
    await YourContract.transferOwnership(
      "ADDRESS_HERE"
    );

    //const YourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: YourContract.address,
  //       contract: "contracts/YourContract.sol:YourContract",
  //       constructorArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }

  const { contractOwner } = await getNamedAccounts();

  console.log(`Deployer address [${deployer}]`);
  console.log(`Contract owner address [${contractOwner}]`);

  const token = await deployments.deploy("DAOToken", {
    from: deployer,
    owner: deployer,
    args: ["DAOToken", "DAO"],
    log: true,
  });

  console.log(`Token address [${token.address}]`);

  const timelockController = await deployments.deploy("TimelockController", {
    from: deployer,
    owner: deployer,
    // access control: https://docs.openzeppelin.com/contracts/4.x/governance#timelock
    args: [0, [], []],
    log: true,
  });

  console.log(`TimelockController address [${timelockController.address}]`);

  const tokenGovernor = await deployments.deploy("DAOGovernor", {
    from: deployer,
    owner: deployer,
    args: [
      token.address,
      timelockController.address,
      6575, // 1 day
      46027, // 1 week
      0,
    ],
    log: true,
  });

  console.log(`DAOGovernor address [${await tokenGovernor.address}]`);

  // https://docs.openzeppelin.com/defender/guide-timelock-roles
  const proposerRole =
    "0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1";
  const executorRole =
    "0xd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63";
  const adminRole =
    "0x5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5";

  // eslint-disable-next-line import/no-unresolved
  const AccessControlABI =
    require("../artifacts/@openzeppelin/contracts/access/AccessControl.sol/AccessControl.json").abi;
  const accessControl = await hre.ethers.getContractAt(
    AccessControlABI,
    timelockController.address,
    await hre.ethers.getSigner(deployer)
  );

  // access control: https://docs.openzeppelin.com/contracts/4.x/governance#timelock
  await accessControl.grantRole(proposerRole, tokenGovernor.address);
  await accessControl.grantRole(executorRole, tokenGovernor.address);
  await accessControl.revokeRole(adminRole, deployer);
};
module.exports.tags = ["YourContract"];
