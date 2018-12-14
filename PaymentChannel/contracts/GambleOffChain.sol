pragma solidity ^0.4.20;

contract GambleOffChain {
    address owner = msg.sender;
    
    mapping(address => Bet) BettorList;
    mapping(address => bool) Exists;
    mapping(uint256 => bool) usedNonces;
    
  
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
    
    function getContractAddress () public view returns (address) {
        return this;
    }
    
    function getBettorBalance (address addy) public view returns (uint) {
        return BettorList[addy].balance; 
    }
    
    function getCasinoBalance () public view returns (uint) {
        return address(this).balance - CasinoLosses;
    }

    // Funds are sent at deployment time.
    function ReceiverPays() public payable { }


    function claimPayment(uint256 amount, uint256 nonce, bytes sig) public {
        require(!usedNonces[nonce]);
        usedNonces[nonce] = true;

        // This recreates the message that was signed on the client.
        bytes32 message = prefixed(keccak256(abi.encodePacked(msg.sender, amount, nonce, this)));

        require(recoverSigner(message, sig) == owner);

        msg.sender.transfer(amount);
    }

    // Destroy contract and reclaim leftover funds.
    function kill() public {
        require(msg.sender == owner);
        selfdestruct(msg.sender);
    }


    // Signature methods

    function splitSignature(bytes sig)
        internal
        pure
        returns (uint8, bytes32, bytes32)
    {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }

    function recoverSigner(bytes32 message, bytes sig)
        internal
        pure
        returns (address)
    {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    // Builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}