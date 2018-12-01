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

      self.refreshBalance()
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

  gambleOnRed: function () {
    self = this
    const color = document.getElementById('redOrBlack').innerText
    const bet = parseInt(document.getElementById('bet').value)
    const win = this.checkResults(color)
    console.log("color ", color)
    console.log("bet ", bet)
    console.log("win ", win)
    let gamble
    Gamble.deployed().then(function (instance) {
      gamble = instance 
      return gamble.betOnPayoutTwo(bet, win, { from: account })
    }).then(function(value) {
      self.setStatus("Your gamble was successfully processed")
    }).catch(function (e) {
      console.log(e)
      self.setStatus("Your gamble failed to process")
    })

    },

  gamble: function () {
    self = this
    this.getRandomNumber()
    this.gambleOnRed()
  },
  

  getRandomNumber: function () {
    const self = this

    let num = Math.floor((Math.random() * 36) + 0);
    let randRedBlack = Math.floor((Math.random() * 36) + 0)
    
    document.getElementById('num').innerHTML = num

    let color = document.getElementById('redOrBlack')
    let color2 = document.getElementById('redOrBlack')

    if (randRedBlack % 2 == 0) {
      color = "Red"
      color2.innerHTML = "Red"
    }
    else {
      color = "Black"
      color2.innerHTML = "Black"
    }

    if (num % 2 == 0) {
      document.getElementById('evenOrOdd').innerHTML = "Even"
    }
    else {
      document.getElementById('evenOrOdd').innerHTML = "Odd"
    }

    self.checkResults(color)


  },

  checkResults: function (colorAns) {
    const self = this
    const color = document.getElementById('color').value
    console.log(color)
    console.log(colorAns)

    if (color == colorAns) {
      return true
    }
    else return false
  },


  sendFunds: function () {
    const self = this
    const recipient = document.getElementById('address').value
    const amount = parseInt(document.getElementById('amountInWei').value)
    let secure
    Payment.deployed().then(function (instance) {
      secure = instance
      console.log(secure)
      return secure.sendFunds(recipient, amount, { from: account })
    }).then(function (value) {
      const balance2 = document.getElementById('newBalance')
      self.setStatus('new function works yeee')
      balance2.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error with new function')
    })
  },

  getBalance3: function () {
    const self = this
    const account_one = document.getElementById('address').value
    let secure 
    Payment.deployed().then(function (instance) {
      secure = instance
      return secure.getBalance.call(account_one, { from: account })
    }).then(function (value) {
      const balance2 = document.getElementById('newBalance')
      self.setStatus('Success')
      balance2.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting new balance.')
    })
  },


  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  getBalance2: function () {
    const self = this
    const account_one = document.getElementById('address').value
    let meta 
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.getBalance2.call(account_one, { from: account_one })
    }).then(function (value) {
      const balance2 = document.getElementById('newBalance')
      self.setStatus('Success')
      balance2.innerHTML = value.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting new balance.')
    })
  },

  refreshBalance: function () {
    const self = this

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.getBalance.call(account, { from: account })
    }).then(function (value) {
      console.log(value)
      const balanceElement = document.getElementById('balance')
      balanceElement.innerHTML = value.valueOf()
      
      const user = document.getElementById('account')
      user.innerHTML = account.valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting balance; see log.')
    })
  },


  sendCoin: function () {
    const self = this

    const amount = parseInt(document.getElementById('amount').value)
    const receiver = document.getElementById('receiver').value
    console.log("receiver ", receiver)
    this.setStatus('Initiating transaction... (please wait)')

    let meta
    MetaCoin.deployed().then(function (instance) {
      meta = instance
      return meta.sendCoin(receiver, amount, { from: account })
    }).then(function () {
      self.setStatus('Transaction complete!')
      self.refreshBalance()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error sending coin; see log.')
    })
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
