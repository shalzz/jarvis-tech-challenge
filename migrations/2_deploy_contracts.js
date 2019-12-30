const EternalStorage = artifacts.require("EternalStorage");
const Proxy = artifacts.require("Proxy");
const KeyValueStore = artifacts.require("KeyValueStore");

module.exports = async function(deployer) {
  // Deploy eternalStorage first - has to be done in this order so that the following contracts already know the storage address
  await deployer.deploy(EternalStorage);
  let storageInstance = await EternalStorage.deployed();
  console.log(storageInstance.address);

  // Deploy our Proxy contract.
  await deployer.deploy(Proxy);
  let proxyInstance = await Proxy.deployed();

  // Allow our main contract to access storage.
  await storageInstance.upgradeVersion(keyValueInstance.address);

  // Deploy our main contract.
  await deployer.deploy(KeyValueStore, Buffer.from("10"), storageInstance.address);
  let keyValueInstance = await KeyValueStore.deployed();
  console.log(keyValueInstance.address);
};
