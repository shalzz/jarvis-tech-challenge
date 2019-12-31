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

  /**** IAM ****/

  function authorizeUser(address user, bytes memory encryptedSharedKey) public restricted {
    setEncSharedKey(user, encryptedSharedKey);
    emit Authorized(user);
  }

  function removeUser(address user) public restricted {
    deleteEncSharedKey(user);
    emit Deauthorized(user);
  }

  function addSecret(bytes memory name, bytes memory value) public restricted {
    setSecret(name, value);
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
