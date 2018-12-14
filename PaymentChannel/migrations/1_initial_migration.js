var Migrations = artifacts.require('./Migrations.sol')
var ConvertLib = artifacts.require('./ConvertLib.sol')
var MetaCoin = artifacts.require('./MetaCoin.sol')
var SecurePayment = artifacts.require('./SecurePayment.sol')
var GambleOnChain = artifacts.require('./GambleOnChain.sol')
var GambleOffChain = artifcats.require('./GambleOffChain')
var mortal = artifacts.require('./mortal.sol')



module.exports = function (deployer) {
  deployer.deploy(Migrations)
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, MetaCoin)
  deployer.deploy(MetaCoin)
  deployer.deploy(mortal)
  deployer.link(mortal, SecurePayment)
  deployer.deploy(SecurePayment)
  deployer.link(mortal, GambleOnChain)
  deployer.deploy(GambleOnChain)
  deployer.deploy(GambleOffChain)
}
