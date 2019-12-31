pragma solidity >=0.4.21 <0.7.0;

import "./UpgradeabilityProxy.sol";
import "./DelegateStorage.sol";
import "./KeyValueStore.sol";

contract KeyValueProxy is UpgradeabilityProxy, DelegateStorage {

  constructor(address _storageAddress) public {
    keyValueStore = KeyValueStore(_storageAddress);
  }
}
