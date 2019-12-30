pragma solidity >=0.4.21 <0.7.0;

import "./KeyValueStore.sol";

contract DelegateStorage {
  KeyValueStore eternalStorage = KeyValueStore(0);
}
