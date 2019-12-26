pragma solidity >=0.4.21 <0.7.0;

contract KeyValueStore {

  /*** STORAGE ***/

  // Mapping from user to sharedKey
  // encrypted with that user's pub key
  mapping(address => bytes) userKeys;

  address[] public authorizedUsers;

  // Mapping from secretName to encryptedSecretValue
  mapping(bytes => bytes) secret;

  constructor(bytes memory _encSharedKey) public {
    userKeys[msg.sender] = _encSharedKey;
    authorizedUsers.push(msg.sender);
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

  /**** IAM ****/

  function authorizeUser(address user, bytes memory encryptedSharedKey) public restricted {
    userKeys[user] = encryptedSharedKey;
    authorizedUsers.push(user);
  }

  function removeUser(address user) public restricted {
    delete userKeys[user];
    // Kludgey. Maybe we can have a better data struct to avoid this
    for (uint i = 0; i < authorizedUsers.length; i++){
      if (authorizedUsers[i] == user) {
        delete authorizedUsers[i];
      }
    }
  }

  /**** Unrestricted functions *****/

  function listUsers() view public returns (address[] memory) {
    return authorizedUsers;
  }

  function getEncSharedKey(address user) view public returns (bytes memory) {
    return userKeys[user];
  }
}
