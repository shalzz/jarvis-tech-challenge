const Proxy = artifacts.require("KeyValueProxy");
const KeyValueStore = artifacts.require("KeyValueStore");
const KeyValueDelegate = artifacts.require("KeyValueDelegate");

module.exports = async function(deployer) {
  // Deploy eternal Storage first - has to be done in this order so that the following contracts already know the storage address
  await deployer.deploy(KeyValueStore);
  let storageInstance = await KeyValueStore.deployed();

  // Deploy our Proxy contract.
  await deployer.deploy(Proxy, storageInstance.address);
  let proxyInstance = await Proxy.deployed();

  // Deploy our logic contract.
  await deployer.deploy(KeyValueDelegate, Buffer.from("0"), storageInstance.address);
  let delegateInstance = await KeyValueDelegate.deployed();
  proxyInstance.upgradeTo("0.1", delegateInstance.address);

  // Allow our proxy contract to access storage.
  await storageInstance.upgradeVersion(proxyInstance.address);
};
