# DAO-Dash
Portfolio and price tracking services for DAOs

## Overview

Welcome to our dapp that leverages some amazing technologies including Chainlink Price Feeds, GRT, and OpenZeppelin.

The project is marketed towards DAOs that have the need to govern and monitor their treasury assets in the form of governed, managed portfolios. 
A portfolio is a contract that comprised of a collection of assets. As the DAO treasury grows and assets are distributed to these portfolios, 
they will need to be re-balanced according to some abstract criteria. 

A DAO's normal workflow would be:

- Initialize an OpenZeppelin Governor contract, mint and distribute the governance tokens
- Holders of the governance token can create proposals for new portfolios
- Executed proposals will emit events that will be real-time tracked in the dApp 
- Re-balancing of the portfolio will also emit events that will be tracked in the dApp

### Integrations

- ChainLink Price Feeds
  - We use ChainLink Price Feeds to get the current prices of each portfolio's assets at the time of re-balancing
  - These price points allow us to easily build a history of the portfolio's running balance with regard to each underlying asset
  - Relevant code can be found in `./packages/hardhat/contracts/PriceConsumer.sol` and `./packages/hardhat/contracts/Portfolio.sol`

- The Graph
  - We use GraphQL to ingest past and future Portfolio and Balance events
  - These events enable us and our partner DAOs to monitor performance of the underlying assets
  - Relevant code can be found in `./packages/subgraph` and `./packages/react-app/src/views/Subgraph.jsx`

## Getting Started

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

First, you will need to start a local hardhat node:
```
yarn chain
# alternatively you can run 'yarn fork' for a mainnet fork
```

Then, you can deploy the contracts with:
```
yarn deploy --reset
```

Next, stand up a local Graph node:
```
yarn run-graph-node
```

Then, compile and deploy the subgraph:
```
yarn graph-create-local
yarn graph-ship-local
```

Finally, start the dApp with:
```
yarn start
```

## Interacting with the DApp

The Portfolio Manager is a page that allows the user to easily interact with all deployed contracts within the dapp.

The example Portfolio contract is made up of 4 assets. A user can manually run the balance 
function to see what it might look like when a re-balancing event occurs. Invoking this function will emit an event 
containing an array showing each asset, the quantity held of the asset and the latest price of the asset according to 
ChainLink Price Feeds.
