pragma solidity >=0.4.21 <0.7.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./Proxy.sol";

contract UpgradeabilityStorage {
  string internal _version;
  address internal _implementation;
  address internal _owner = msg.sender;

  function version() public view returns (string memory) {
    return _version;
  }

  function implementation() public view returns (address) {
    return _implementation;
  }
}

contract UpgradeabilityProxy is Proxy, UpgradeabilityStorage {
  event Upgraded(string version, address indexed implementation);

  function upgradeTo(string memory version, address implementation) public {
    require(_owner == msg.sender, "owner: caller is not the owner");
    require(_implementation != implementation);
    _version = version;
    _implementation = implementation;
    emit Upgraded(version, implementation);
  }
}

