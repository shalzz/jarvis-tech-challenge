pragma solidity >=0.4.21 <0.7.0;

contract KeyValueStore {

  /*** STORAGE ***/

  // Mapping from user to sharedKey
  // encrypted with that user's pub key
  mapping(address => bytes) userKeys;

  address[] public authorizeUsers;

  // Mapping from secretName to encryptedSecretValue
  mapping(bytes => bytes) secret;

  constructor() public {
    authorizeUser(msg.sender, new bytes(1));
  }

  /**
   * @dev Throws if called by any account not authorized.
   */
  modifier restricted() {
      require(isAuthorized(), "restricted: caller is not authorized");
      _;
  }

  /**
   * @dev Returns true if the caller is authorized.
   */
  function isAuthorized() public view returns (bool) {
      return userKeys[msg.sender].length != 0;
  }

  function listUsers() view public returns (address[] memory) {
    return authorizeUsers;
  }

  function authorizeUser(address user, bytes memory encryptedSharedKey) public restricted {
    userKeys[user] = encryptedSharedKey;
    authorizeUsers.push(user);
  }

  function removeUser(address user) public restricted {
    delete userKeys[user];
  }

  // TODO: can be public
  function getEncSharedKey(address user) view public restricted returns (bytes memory) {
    return userKeys[user];
  }
}
