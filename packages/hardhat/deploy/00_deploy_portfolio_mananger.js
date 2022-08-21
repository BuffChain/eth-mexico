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

  await deploy("PriceConsumer", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  const PriceConsumer = await ethers.getContract(
    "PriceConsumer",
    deployer
  );

  console.log(`PriceConsumer Address [${PriceConsumer.address}]`);

  await deploy("PortfolioManager", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [daoGovernorAddress, await PriceConsumer.address],
    log: true,
    waitConfirmations: 5,
  });

  const PortfolioManager = await ethers.getContract(
    "PortfolioManager",
    deployer
  );

  const USDT = "0x13512979ADE267AB5100878E2e0f485B568328a4";
  const USDC = "0xe22da380ee6B445bb8273C81944ADEB6E8450422";
  const DAI = "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD";
  const WETH = "0xd0A1E359811322d97991E03f863a0C30C2cF029C";

  const portfolio1AddressTxResponse = await PortfolioManager.createPortfolio(
    "test portfolio 1",
    [USDT, USDC, DAI]
  );

  const portfolio1AddressTxReceipt = await portfolio1AddressTxResponse.wait();
  const portfolio1CreatedEvent = portfolio1AddressTxReceipt.events.find(event => event.event === "PortfolioCreated");
  const portfolioAddress1 = portfolio1CreatedEvent.args[1];

  console.log(`Portfolio 1 Address [${portfolioAddress1}]`);

  const portfolio2AddressTxResponse = await PortfolioManager.createPortfolio(
    "test portfolio 2",
    [USDT, WETH]
  );

  const portfolio2AddressTxReceipt = await portfolio2AddressTxResponse.wait();
  const portfolio2CreatedEvent = portfolio2AddressTxReceipt.events.find(event => event.event === "PortfolioCreated");
  const portfolioAddress2 = portfolio2CreatedEvent.args[1];

  console.log(`Portfolio 2 Address [${portfolioAddress2}]`);

  await PortfolioManager.transferOwnership(daoGovernorAddress);

  await deploy("Portfolio", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: ["debug portfolio", [USDT, USDC, DAI, WETH], await PriceConsumer.address],
    log: true,
    waitConfirmations: 5,
  });

  const deployerAcct = await hre.ethers.getSigner(deployer);
  const ethAmt = hre.ethers.utils.parseEther("5");
  await deployerAcct.sendTransaction({
    to: portfolioAddress1,
    value: ethAmt
  });

  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [portfolioAddress1]
  });

  const portfolio1 = await ethers.getContract(
    "Portfolio",
    portfolioAddress1
  );

  await portfolio1.balance();
  await portfolio1.balance();
  await portfolio1.balance();

  await hre.network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [portfolioAddress1]
  });
};
module.exports.tags = ["eth-mexico-dapp-v0.0.1"];
