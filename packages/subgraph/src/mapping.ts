import {BigInt, Address, Bytes} from "@graphprotocol/graph-ts";
import {
  PortfolioManager,
  PortfolioCreated,
} from "../generated/PortfolioManager/PortfolioManager";
import { Token, Portfolio } from "../generated/schema";

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
