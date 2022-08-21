import {BigInt, Address, Bytes} from "@graphprotocol/graph-ts";
import {
  PortfolioCreated,
} from "../generated/PortfolioManager/PortfolioManager";
import {
  PortfolioBalanced, PortfolioBalancedTokenDetailsStruct,
} from "../generated/Portfolio/Portfolio";
import { Portfolio, Balance } from "../generated/schema";

export function handlePortfolioCreated(event: PortfolioCreated): void {
  let portfolioName = event.params.portfolioName;
  let portfolioAddress = event.params.portfolioAddress.toHexString();
  let portfolioTokens: Bytes[] = event.params.tokens.map<Bytes>((address: Address): Bytes => Bytes.fromHexString(address.toHexString()));

  let portfolio = new Portfolio(portfolioAddress);
  portfolio.name = portfolioName;
  portfolio.address = Bytes.fromHexString(portfolioAddress);
  portfolio.tokens = portfolioTokens;
  portfolio.createdAt = event.block.timestamp;

  portfolio.save();
}

export function handlePortfolioBalanced(event: PortfolioBalanced): void {
  // let balance = new Balance(event.params.portfolio.toHexString());
  //
  // let balancedTokens = event.params.tokenDetails;
  // // balancedTokens.forEach(function (balancedToken: PortfolioBalancedTokenDetailsStruct) {
  // //   let balanceAddress = balancedToken.token.toHexString();
  // //
  // //   balance.tokens
  // //
  // //   // balance.tokens[0].token = Bytes.fromHexString(balanceAddress);
  // //   // balance.quantity = balancedToken.quantity;
  // //   // balance.price = balancedToken.price;
  // //   // balance.createdAt = blockTime;
  // // });
  //
  // balance.tokens = balancedTokens.map<string>(function (balancedToken: PortfolioBalancedTokenDetailsStruct): string {
  //   let balanceAddress = balancedToken.token.toHexString();
  //
  //   // balance.tokens
  //   // balance.tokens[0].token = Bytes.fromHexString(balanceAddress);
  //   // balance.quantity = balancedToken.quantity;
  //   // balance.price = balancedToken.price;
  //   // balance.createdAt = blockTime;
  //
  //   return balanceAddress
  // });
  //
  // balance.save();
}
