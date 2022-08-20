pragma solidity ^0.8.0;

contract Portfolio {

    event PortfolioBalanced();

    string public name;
    address[] public tokens;

    constructor(string memory _name, address[] memory _tokens) payable {
        name = name;
        tokens = _tokens;
    }

    function balance() public {
        emit PortfolioBalanced();
    }

    receive() external payable {}
    fallback() external payable {}

}
