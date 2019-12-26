const Migrations = artifacts.require("Migrations");
const KeyValueStore = artifacts.require("KeyValueStore");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(KeyValueStore, Buffer.from("0"));
};
