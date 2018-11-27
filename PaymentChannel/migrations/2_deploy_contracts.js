var ConvertLib = artifacts.require('./ConvertLib.sol')
var MetaCoin = artifacts.require('./MetaCoin.sol')
var SecurePayment = artifacts.require('./SecurePayment.sol')
var mortal = artifacts.require('./mortal.sol')


module.exports = function (deployer) {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, MetaCoin)
  deployer.deploy(MetaCoin)
  deployer.deploy(mortal)
  deployer.link(mortal, SecurePayment)
  deployer.deploy(SecurePayment)
}
