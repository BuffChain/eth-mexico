pragma solidity ^0.8.0;

contract Portfolio {

    event PortfolioBalanced(TokenDetails[] tokenDetails);

    string name;
    address[] tokens;
    TokenDetails[] tokenDetails;
    mapping(address => address) priceFeeds;

    struct TokenDetails {
        address token;
        uint256 quantity;
        uint256 price;
    }

    constructor(string memory _name, address[] memory _tokens) payable {
        name = _name;
        tokens = _tokens;
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
            uint256 quantity = block.timestamp % (i + 1) + 1;
            uint256 price = 0;
            TokenDetails memory td = TokenDetails(token, quantity, price);
            tokenDetails.push(td);
        }

        emit PortfolioBalanced(tokenDetails);
    }

    function getPortfolioDetails() public view returns(TokenDetails[] memory) {
        return tokenDetails;
    }

    receive() external payable {}
    fallback() external payable {}

}
