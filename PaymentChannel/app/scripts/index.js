// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metaCoinArtifact from '../../build/contracts/MetaCoin.json'

import securePaymentArtifact from '../../build/contracts/SecurePayment.json'
import gambleOnChainArtifcat from '../../build/contracts/GambleOnChain.json'


// MetaCoin is our usable abstraction, which we'll use through the code below.
const MetaCoin = contract(metaCoinArtifact)
const Payment = contract(securePaymentArtifact)
const Gamble = contract(gambleOnChainArtifcat)


// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account

let account_one 




//---------------------------------MetaCoin Contract-------------------------//
const App = {
  start: function () {
    const self = this

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider)
    Payment.setProvider(web3.currentProvider)
    Gamble.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }
      accounts = accs
      account = accounts[0]
      //self.refreshBalance()
    })

  

  },

  addFunds: function () {
    const self = this 

    let amount = 2500000000000000000
    let gamble

    Gamble.deployed().then(function (instance) {
      gamble = instance
      console.log(gamble)
      return gamble.addFunds( {from: account, value: 2500000000000000000})
    }).then(function (value) {
      self.getBettorBalance()
      self.getCasinoBalance()
      self.setStatus('successfully added funds')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error adding 2.5 ether')
    })
  },

  getBettorBalance: function () {
    const self = this 

    let balance = document.getElementById('gambler')
    let gamble

    Gamble.deployed().then(function (instance) {
      gamble = instance
      return gamble.getBettorBalance({ from: account })
    }).then(function (value) {      
      self.setStatus('new function works yeee')
      balance.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error with new function')
    })

  },

  getCasinoBalance: function () {
    const self = this

    let balance = document.getElementById('casino')
    let gamble
    Gamble.deployed().then(function (instance) {
      gamble = instance
      return gamble.getCasinoBalance( {from: account })
    }).then(function (value) {
      balance.innerHTML = value.valueOf()
      self.setStatus('Successfully got casino balance')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Failed to get Casino balance')
    })
  },


  getContractAddress: function () {
    const self = this 
    let address = document.getElementById('contractAddress')
    let gamble 
    Gamble.deployed().then(function (instance) {
      gamble = instance
      return gamble.getContractAddress( { from: account })
    }).then(function (value) {
      address.innerHTML = value.valueOf()
      self.setStatus('Got contract address')
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Failed to get contract address')
    })

  },

  withdrawFunds: function () {
    const self = this
    let amount = parseFloat(document.getElementById('withdraw').value)
    let gamble 
    Gamble.deployed().then(function (instance) {
      gamble = instance
      return gamble.withdrawMoney(amount, {from: account})
    }).then(function (value) {
      self.getCasinoBalance()
      self.getBettorBalance()
      self.setStatus("Withdraw Successful")
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Failed to withdraw funds')
    })
  },

  gambleOnRed: function () {
    self = this
    const color = document.getElementById('casinoRedBlack').innerText
    const bet = parseFloat(document.getElementById('bettorBet').value)
    const casinoNumber = document.getElementById('casinoNumber').innerText
    var win
    if (casinoNumber === 0) {
      win = false
    }
    else {
      win = this.checkColorResults(color)  
    }
    console.log("color ", color)
    console.log("bet ", bet)
    console.log("win ", win)
    let gamble
    Gamble.deployed().then(function (instance) {
      gamble = instance 
      return gamble.betOnPayoutTwo(bet, win, { from: account })
    }).then(function(value) {
      self.getCasinoBalance()
      self.getBettorBalance()
      self.setStatus("Your gamble was successfully processed")
    }).catch(function (e) {
      console.log(e)
      self.setStatus("Your gamble failed to process")
    })

  },

  evenOddResult: function () {
    self = this
    const evenOrOdd = document.getElementById('casinoEvenOdd').innerText
    const bet = parseFloat(document.getElementById('bettorBet').value)
    const casinoNumber = document.getElementById('casinoNumber').innerText
    var win
    if (casinoNumber === 0) {
      win = lose
    }
    else {
      win = this.checkEvenOddResults(evenOrOdd)
    }

    console.log("even or odd ", evenOrOdd)
    console.log("bet ", bet)
    console.log("win ", win)
    let gamble
    Gamble.deployed().then(function (instance) {
      gamble = instance 
      return gamble.betOnPayoutTwo(bet, win, { from: account })
    }).then(function(value) {
      self.getCasinoBalance()
      self.getBettorBalance()
      self.setStatus("Your gamble was successfully processed")
    }).catch(function (e) {
      console.log(e)
      self.setStatus("Your gamble failed to process")
    })

  },

  convertToWei: function () {
    self = this
    const eth = parseFloat(document.getElementById('ether').value)
    var wei = document.getElementById('wei')
    wei.innerHTML = eth * Math.pow(10, 18)
  },

  numberResult: function () {
    self = this
    const casinoNumber = document.getElementById('casinoNumber').innerText
    const bet = parseFloat(document.getElementById('bettorBet').value)
    var win
    if (casinoNumber === 0) {
      win = false
    }
    else {
      win = this.checkNumResults(casinoNumber)  
    }
    console.log("Casino Number ", casinoNumber)
    console.log("bet ", bet)
    console.log("win ", win)
    let gamble
    Gamble.deployed().then(function (instance) {
      gamble = instance 
      return gamble.payout35(bet, win, { from: account })
    }).then(function(value) {
      self.getCasinoBalance()
      self.getBettorBalance()
      self.setStatus("Your gamble was successfully processed")
    }).catch(function (e) {
      console.log(e)
      self.setStatus("Your gamble failed to process")
    })

  },

  checkExists: function () {
    const self = this

    let gamble
    var result
    Gamble.deployed().then(function (instance) {
      gamble = instance
      return gamble.checkExists( {from: account })
    }).then(function (value) {
      self.setStatus("checkExists works")
      console.log(value.valueOf())
      console.log(value)
      return value.valueOf()
    }).catch(function (e) {
      console.log(e)
    })
  },

  gambleOnColor: function () {
    const self = this
    const pass = function() {
      self.checkExists()
    }
    
    if (pass) {
      //self.getRandomNumber()
      self.gambleOnRed()
    }
  },
  
  gambleEvenOdd: function () {
    const self = this

    const pass = function() {
      self.checkExists()
    }
    if (pass) {
      //self.getRandomNumber()
      self.evenOddResult()
    }
  },

  gambleOnNum: function () {
    const self = this
    const pass = function() {
      self.checkExists()
    }
    if (pass) {
      //self.getRandomNumber()
      self.numberResult()
    }
  },

  getRandomNumber: function (num, betType) {
    const self = this

    // let num = Math.floor((Math.random() * 37) + 0);
    // let randRedBlack = Math.floor((Math.random() * 37) + 0)
    
    //const num = parseInt(document.getElementById('casinoNumber').value)
    
    //document.getElementById('casinoNumber').innerHTML = num

    let color = document.getElementById('casinoRedBlack')
    let color2 = document.getElementById('casinoRedBlack')

    // if (randRedBlack % 2 == 0) {
      if (num % 2 == 0 && num !== 0) {
      color = "Red"
      color2.innerHTML = "Red"
      }
      else if (num === 0) {
        color = "Green"
        color2.innerHTML = "Green"
      }
      else {
        color = "Black"
        color2.innerHTML = "Black"
      }

    if (num % 2 == 0) {
      document.getElementById('casinoEvenOdd').innerHTML = "Even"
    }
    else {
      document.getElementById('casinoEvenOdd').innerHTML = "Odd"
    }


    if (betType === "color") {
      self.gambleOnColor()
    }
    else if (betType === "number") {
      self.gambleOnNum()
    }
    else if (betType === "evenOdd") {
      self.gambleEvenOdd()
    }
    else {
      alert("you didn't gamble on anything")
    }


    //self.checkResults(color)


  },

  checkColorResults: function (colorAns) {
    const self = this
    const color = document.getElementById('bettorColor').value
    console.log(color)
    console.log(colorAns)

    if (color == colorAns) {
      return true
    }
    else return false
  },

  checkEvenOddResults: function (result) {
    const self = this
    const evenOdd = document.getElementById('bettorEvenOdd').value
    console.log(evenOdd)
    console.log(result)

    if (evenOdd == result) {
      return true
    }
    else return false
  },

  checkNumResults: function (result) {
    const self = this
    const num = document.getElementById('bettorNumber').value
    console.log(num)
    console.log(result)

    if (num == result) {
      return true
    }
    else return false
  },


  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  }

}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }

  App.start()
})
