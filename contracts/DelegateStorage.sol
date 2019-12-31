pragma solidity >=0.4.21 <0.7.0;

import "./KeyValueStore.sol";

contract DelegateStorage {
  KeyValueStore keyValueStore = KeyValueStore(0);

  event Authorized(address indexed user);
  event Deauthorized(address indexed user);
}
