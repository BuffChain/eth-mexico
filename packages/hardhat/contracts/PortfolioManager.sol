pragma solidity ^0.8.0;

import "./Portfolio.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PortfolioManager is Ownable {

    constructor (address newOwner) {
//        transferOwnership(newOwner);
    }

    event PortfolioCreated(string portfolioName, address portfolioAddress, address[] tokens);

    function createPortfolio(string memory portfolioName, address[] memory tokens) public onlyOwner returns (address) {
        Portfolio portfolio = new Portfolio(portfolioName, tokens);
        address portfolioAddress = address(portfolio);
        emit PortfolioCreated(portfolioName, portfolioAddress, tokens);
        return portfolioAddress;
    }

}
