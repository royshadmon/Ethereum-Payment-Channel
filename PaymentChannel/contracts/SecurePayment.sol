pragma solidity ^0.4.20;

import './mortal.sol';

contract SecureSpending is mortal {
    
  // mapping(address => Permission) mySenderList;
  // mapping(address => Receiver) myReceiverList;
  
  // event newAddressAddedToSenderList(address thePersonAddeed, address theNewAddress, uint maxAmountCanTransfer);
  // event newAddressAddedToReceiverList(address thePersonAdded, address theNewAddress);
  
  // struct Permission {
  //     bool isAllowed;
  //     uint maxTransferAmount;
  // }
  
  // struct Receiver {
  //     bool isAllowed;
  // }
  
  // function addAddressToSenderList(address permitted, uint maxTransferAmount) public onlyOwner {
  //     mySenderList[permitted] = Permission(true, maxTransferAmount);
  //     emit newAddressAddedToSenderList(msg.sender, permitted, maxTransferAmount);
  // }
  
  // function addAddressToReceiverList(address permitted) public onlyOwner {
  //     myReceiverList[permitted] = Receiver(true);
  //     emit newAddressAddedToReceiverList(msg.sender, permitted);
  // }
  
  // function removeFromAddressToSenderList(address notPermitted) public onlyOwner {
  //     delete mySenderList[notPermitted];
  // }
  
  // function removeAddressFromReceiverList(address notPermitted) public onlyOwner {
  //     delete myReceiverList[notPermitted];
  // }
  
  function sendFunds(address receiver, uint amountInWei) public {
        // require(mySenderList[msg.sender].isAllowed);
        // require(myReceiverList[receiver].isAllowed);
        // require(mySenderList[msg.sender].maxTransferAmount >= amountInWei);
        receiver.transfer(amountInWei);
    }
    
    function getAddress () public view returns (address) {
        return msg.sender;
    }

    function getBalance (address addy) public view returns (uint256) {
        return addy.balance; 
    }
  
  function () public payable {
      
  }
}