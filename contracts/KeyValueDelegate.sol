pragma solidity >=0.4.21 <0.7.0;

import "./DelegateStorage.sol";
import "./UpgradeabilityProxy.sol";

contract KeyValueDelegate is UpgradeabilityStorage, DelegateStorage {

  /**
   * @dev Throws if called by any account not authorized.
   */
  modifier restricted() {
      require(
        getEncSharedKey(msg.sender).length != 0,
        "restricted: caller is not authorized"
      );
      _;
  }

  constructor(bytes memory _encSharedKey, address _storageAddress) public {
    keyValueStore = KeyValueStore(_storageAddress);
    setEncSharedKey(msg.sender, _encSharedKey);
    authorizedUsers.push(msg.sender);
  }

  /**** IAM ****/

  function authorizeUser(address user, bytes memory encryptedSharedKey) public restricted {
    setEncSharedKey(user, encryptedSharedKey);
    authorizedUsers.push(user);
  }

  function removeUser(address user) public restricted {
    deleteEncSharedKey(user);
    // Kludgey. Maybe we can have a better data struct to avoid this
    for (uint i = 0; i < authorizedUsers.length; i++){
      if (authorizedUsers[i] == user) {
        delete authorizedUsers[i];
      }
    }
  }

  function addSecret(bytes memory name, bytes memory value) public restricted {
    setSecret(name, value);
  }

  /**** Unrestricted functions *****/

  function listUsers() view public returns (address[] memory) {
    return authorizedUsers;
  }

  /***** Helpers *****/

  function getEncSharedKey(address user) view public returns (bytes memory) {
    return keyValueStore.getBytes(keccak256(abi.encodePacked("userkeys", user)));
  }

  function setEncSharedKey(address user, bytes memory encryptedSharedKey) internal {
    keyValueStore.setBytes(keccak256(abi.encodePacked("userkeys", user)), encryptedSharedKey);
  }

  function deleteEncSharedKey(address user) internal {
    keyValueStore.deleteBytes(keccak256(abi.encodePacked("userkeys", user)));
  }

  function getSecret(bytes memory name) view public returns (bytes memory) {
    return keyValueStore.getBytes(keccak256(abi.encodePacked("secrets", name)));
  }

  function setSecret(bytes memory name, bytes memory value) internal {
    keyValueStore.setBytes(keccak256(abi.encodePacked("secrets", name)), value);
  }
}
