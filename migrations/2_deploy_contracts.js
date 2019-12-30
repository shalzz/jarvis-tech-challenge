const Proxy = artifacts.require("KeyValueProxy");
const KeyValueStore = artifacts.require("KeyValueStore");
const KeyValueDelegate = artifacts.require("KeyValueDelegate");

module.exports = async function(deployer) {
  // Deploy eternalStorage first - has to be done in this order so that the following contracts already know the storage address
  await deployer.deploy(KeyValueStore);
  let storageInstance = await KeyValueStore.deployed();

  // Deploy our main contract.
  await deployer.deploy(KeyValueDelegate, Buffer.from("0"), storageInstance.address);
  let delegateInstance = await KeyValueDelegate.deployed();

  // Deploy our Proxy contract.
  await deployer.deploy(Proxy);
  let proxyInstance = await Proxy.deployed();
  proxyInstance.upgradeTo("0.1", delegateInstance.address);
  console.log(proxyInstance.address);

  // Allow our main contract to access storage.
  await storageInstance.upgradeVersion(delegateInstance.address);
};
