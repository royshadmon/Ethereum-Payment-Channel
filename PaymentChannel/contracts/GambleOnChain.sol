pragma solidity ^0.4.20;

import './mortal.sol';

contract GambleOnChain is mortal {
    
  mapping(address => Bet) BettorList;
  mapping(address => bool) Exists;
  
  uint CasinoLosses = 0;
  
  
  event senderAndAmount(address senderAddress, uint amountInWei);
  
  event newAddressAddedToSenderList(address thePersonAddeed, address theNewAddress, uint maxAmountCanTransfer);
  event newBettor(address newBettor, uint balance);
  event oldBettor(address oldBettor, uint newBalance);
  
  struct Bet {
      uint balance; 
  }
 
  
  function addFunds () public payable {
      if (msg.value <= 0) {
          revert("You must add more money");
      }
      if (msg.value > msg.sender.balance) {
          revert("You don't have that much money");
      }
      //check if user already exists. if so add to their value if not create new user
      if (Exists[msg.sender] == false) {
          Exists[msg.sender] = true;
          BettorList[msg.sender] = Bet(msg.value);
          emit newBettor(msg.sender, msg.value); 
      }
      else {
        BettorList[msg.sender].balance += msg.value;
        emit oldBettor(msg.sender, BettorList[msg.sender].balance);      
      }
      
        
      
      
  } 
  
  // winning even/odd or red/black bet
  function betOnPayoutTwo (uint bet, bool win) public payable {
      if (bet > BettorList[msg.sender].balance) {
          revert("You dont have enough money in your account to bet that much");
      }
      if (bet * 2 > address(this).balance/10) {
          revert("Casino cant afford to take your bet");
      }
      if (win) {
        BettorList[msg.sender] = Bet(BettorList[msg.sender].balance + bet*2); 
        CasinoLosses += bet * 2;
      }
      else {
        BettorList[msg.sender] = Bet(BettorList[msg.sender].balance - bet);  
        CasinoLosses -= bet;
      }
      
  }
    // function winPayout35 (address winner, uint bet) private {
    //     if (Exists[winner]) {
    //         BettorList[winner].balance += (bet * 35);
    //     }
    // }  
  
  function withdrawMoney (uint amountInWei) public payable {
        if (Exists[msg.sender] == false) {
            revert("You're not allowed to make a transaction");
        }
        if (amountInWei > BettorList[msg.sender].balance && amountInWei > address(this).balance) {
            revert("You don't have that much money to withdraw");
        }
        BettorList[msg.sender].balance -= amountInWei;
        msg.sender.transfer(amountInWei);
        
        if (BettorList[msg.sender].balance == 0) {
            removeBettorFromList(msg.sender);
        }
        
    }  
  
    function removeBettorFromList (address bettor) public {
        delete BettorList[bettor];
        delete Exists[bettor];
    }  


    function () public payable {
    }
  
    
    
    function getContractAddress () public view returns (address) {
        return this;
    }
    
    function getBettorBalance () public view returns (uint) {
        return BettorList[msg.sender].balance; 
    }
    
    function getCasinoBalance () public view returns (uint) {
        return address(this).balance - CasinoLosses;
    } 
    
    
  

  
//   function addAddressToSenderList(address permitted) public onlyOwner {
//       mySenderList[permitted] = Permission(true, msg.value);
//       emit newAddressAddedToSenderList(msg.sender, permitted, msg.value);
//   }
  
  // function addAddressToReceiverList(address permitted) public onlyOwner {
  //     myReceiverList[permitted] = Receiver(true);
  //     emit newAddressAddedToReceiverList(msg.sender, permitted);
  // }
  
//   function removeFromAddressToSenderList(address notPermitted) public onlyOwner {
//       delete mySenderList[notPermitted];
//   }
  
  // function removeAddressFromReceiverList(address notPermitted) public onlyOwner {
  //     delete myReceiverList[notPermitted];
  // }

}