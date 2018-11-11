pragma solidity ^0.4.20;

contract mortal {
    address owner;
    
    constructor() payable public {
        owner = msg.sender; 
    }
    
    modifier onlyOwner() {
      if(owner == msg.sender) {
          _;
      }
      else revert();
  }
    
    function kill() public onlyOwner{
        selfdestruct(owner);
    }
}