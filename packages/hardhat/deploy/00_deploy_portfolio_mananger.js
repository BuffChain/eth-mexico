// deploy/00_deploy_portfolio_mananger.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(`Deployer address [${deployer}]`);

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

  const daoGovernor = await deployments.deploy("DAOGovernor", {
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

  const daoGovernorAddress = await daoGovernor.address;

  console.log(`DAOGovernor address [${daoGovernorAddress}]`);

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
  await accessControl.grantRole(proposerRole, daoGovernorAddress);
  await accessControl.grantRole(executorRole, daoGovernorAddress);
  await accessControl.revokeRole(adminRole, deployer);

  await deploy("PortfolioManager", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [daoGovernorAddress],
    log: true,
    waitConfirmations: 5,
  });

  const PortfolioManager = await ethers.getContract(
    "PortfolioManager",
    deployer
  );

  const portfolioAddressTxResponse = await PortfolioManager.createPortfolio(
    "test portfolio 1",
    ["0xdAC17F958D2ee523a2206206994597C13D831ec7"]
  );

  const portfolioAddressTxReceipt = await portfolioAddressTxResponse.wait();
  const portfolioCreatedEvent = portfolioAddressTxReceipt.events.find(event => event.event === "PortfolioCreated");
  const portfolioAddress = portfolioCreatedEvent.args[1];

  console.log(`Portfolio address [${portfolioAddress}]`);

  await PortfolioManager.transferOwnership(daoGovernorAddress);
};
module.exports.tags = ["eth-mexico-dapp-v0.0.1"];
