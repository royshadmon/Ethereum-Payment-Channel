pragma solidity ^0.4.20;

import './mortal.sol';

contract GambleOnChain is mortal {
    
  mapping(address => Bet) BettorList;
  mapping(address => bool) Exists;
  
  uint CasinoBalance = address(this).balance;
  
  
  event senderAndAmount(address senderAddress, uint amountInWei);
  
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
  function betOnPayout2 (uint bet, bool win) private {
      if (bet > BettorList[msg.sender].balance) {
          revert("You don't have enough money in your account to bet that much");
      }
      if (bet * 2 > CasinoBalance/10) {
          revert("Casino can't afford to take your bet");
      }
      if (win) {
        BettorList[msg.sender] = Bet(BettorList[msg.sender].balance + bet*2); 
        CasinoBalance -= bet * 2;
      }
      else {
        BettorList[msg.sender] = Bet(BettorList[msg.sender].balance - bet);  
        CasinoBalance += bet;
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
  
    function removeBettorFromList (address bettor) private {
        delete BettorList[bettor];
        delete Exists[bettor];
    }  


    function () public payable {
    }
  
    
    
    function getContractAddress () public view returns (address) {
        return this;
    }
    
    function getBettorBalance (address addy) public view returns (uint) {
        return BettorList[addy].balance; 
    }
    
    function getCasinoBalance () public view returns (uint) {
        return CasinoBalance;
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