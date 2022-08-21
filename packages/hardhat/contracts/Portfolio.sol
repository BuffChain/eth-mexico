pragma solidity ^0.8.0;

import "./PriceConsumer.sol";

contract Portfolio {

    event PortfolioBalanced(TokenDetails[] tokenDetails);

    string name;
    address[] tokens;
    TokenDetails[] tokenDetails;
    mapping(address => address) priceFeeds;
    PriceConsumer priceConsumer;

    struct TokenDetails {
        address token;
        uint256 quantity;
        int256 price;
    }

    constructor(string memory _name, address[] memory _tokens, PriceConsumer _priceConsumer) payable {
        name = _name;
        tokens = _tokens;
        priceConsumer = _priceConsumer;

        address weth = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;
        address usdt = 0x13512979ADE267AB5100878E2e0f485B568328a4;
        address usdc = 0xe22da380ee6B445bb8273C81944ADEB6E8450422;
        address dai = 0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD;

//        ETH Mainnet
//        address ethPriceFeed = 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419;
//        address usdtPriceFeed = 0x3E7d1eAB13ad0104d2750B8863b489D65364e32D;
//        address usdcPriceFeed = 0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6;
//        address daiPriceFeed = 0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9;

        //        Polygon PoS Mainnet
        address ethPriceFeed = 0xF9680D99D6C9589e2a93a78A04A279e509205945;
        address usdtPriceFeed = 0x0A6513e40db6EB1b165753AD52E80663aeA50545;
        address usdcPriceFeed = 0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7;
        address daiPriceFeed = 0x4746DeC9e833A82EC7C2C1356372CcF2cfcD2F3D;

        setTokenPriceFeed(weth, ethPriceFeed);
        setTokenPriceFeed(usdt, usdtPriceFeed);
        setTokenPriceFeed(usdc, usdcPriceFeed);
        setTokenPriceFeed(dai, daiPriceFeed);

    }

    function _name() public view returns (string memory) {
        return name;
    }

    function _tokens() public view returns (address[] memory) {
        return tokens;
    }

    function balance() public {

        delete tokenDetails;
        for (uint256 i = 0; i < tokens.length; i++) {
            address token = tokens[i];
//            swap out balancing algorithm here
            uint256 quantity = block.timestamp % (i + 21) + (13 * 91);
            int256 price = 0;
            address priceFeed = priceFeeds[token];

            if (priceFeed != address(0)) {
                price = priceConsumer.getLatestPrice(priceFeeds[token]);
            }

            TokenDetails memory td = TokenDetails(token, quantity, price);
            tokenDetails.push(td);
        }

        emit PortfolioBalanced(tokenDetails);
    }

    function setTokenPriceFeed(address token, address priceFeed) public {
        priceFeeds[token] = priceFeed;
    }

    function getPortfolioDetails() public view returns(TokenDetails[] memory) {
        return tokenDetails;
    }

    receive() external payable {}
    fallback() external payable {}

}
