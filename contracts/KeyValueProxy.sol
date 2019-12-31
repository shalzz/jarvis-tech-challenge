pragma solidity >=0.4.21 <0.7.0;

import "./UpgradeabilityProxy.sol";
import "./DelegateStorage.sol";
import "./KeyValueStore.sol";

contract KeyValueProxy is UpgradeabilityProxy, DelegateStorage {

  constructor(address _storageAddress, bytes memory _encSharedKey) public {
    keyValueStore = KeyValueStore(_storageAddress);
    keyValueStore.setBytes(keccak256(abi.encodePacked("userkeys", msg.sender)), _encSharedKey);
    emit Authorized(msg.sender); //TODO: remove?
  }
}
