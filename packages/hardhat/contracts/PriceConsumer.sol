pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumer {

    /**
     * Returns the latest price
     */
    function getLatestPrice(address aggregator) public view returns (int) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(aggregator);
        (
        /*uint80 roundID*/,
        int price,
        /*uint startedAt*/,
        /*uint timeStamp*/,
        /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        return price;
    }

}
