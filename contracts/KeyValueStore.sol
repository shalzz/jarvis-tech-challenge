pragma solidity 0.5.8;

contract KeyValueStore {

    address owner = msg.sender;
    address latestVersion;

    mapping(bytes32 => uint) uIntStorage;
    mapping(bytes32 => string) stringStorage;
    mapping(bytes32 => address) addressStorage;
    mapping(bytes32 => bytes) bytesStorage;
    mapping(bytes32 => bool) boolStorage;
    mapping(bytes32 => int) intStorage;

    modifier onlyLatestVersion() {
      // The owner and other contracts are only allowed to set the storage upon deployment to register the initial contracts/settings, afterwards their direct access is disabled
        if (latestVersion != address(0)) {
            // Make sure the access is permitted to only contracts in our Dapp
            require(msg.sender == latestVersion,
               "onlyLatestVersion: caller is not the latestVersion");
        }
        _;
    }

    function upgradeVersion(address _newVersion) public {
        require(msg.sender == owner, "upgradeVersion: caller is not the owner");
        latestVersion = _newVersion;
    }

    // *** Getter Methods ***
    function getUint(bytes32 _key) external view returns(uint) {
        return uIntStorage[_key];
    }

    function getString(bytes32 _key) external view returns(string memory) {
        return stringStorage[_key];
    }

    function getAddress(bytes32 _key) external view returns(address) {
        return addressStorage[_key];
    }

    function getBytes(bytes32 _key) external view returns(bytes memory) {
        return bytesStorage[_key];
    }

    function getBool(bytes32 _key) external view returns(bool) {
        return boolStorage[_key];
    }

    function getInt(bytes32 _key) external view returns(int) {
        return intStorage[_key];
    }

    // *** Setter Methods ***
    function setUint(bytes32 _key, uint _value) onlyLatestVersion external {
        uIntStorage[_key] = _value;
    }

    function setString(bytes32 _key, string memory _value) onlyLatestVersion public {
        stringStorage[_key] = _value;
    }

    function setAddress(bytes32 _key, address _value) onlyLatestVersion external {
        addressStorage[_key] = _value;
    }

    function setBytes(bytes32 _key, bytes memory _value) onlyLatestVersion public {
        bytesStorage[_key] = _value;
    }

    function setBool(bytes32 _key, bool _value) onlyLatestVersion external {
        boolStorage[_key] = _value;
    }

    function setInt(bytes32 _key, int _value) onlyLatestVersion external {
        intStorage[_key] = _value;
    }

    // *** Delete Methods ***
    function deleteUint(bytes32 _key) onlyLatestVersion external {
        delete uIntStorage[_key];
    }

    function deleteString(bytes32 _key) onlyLatestVersion external {
        delete stringStorage[_key];
    }

    function deleteAddress(bytes32 _key) onlyLatestVersion external {
        delete addressStorage[_key];
    }

    function deleteBytes(bytes32 _key) onlyLatestVersion external {
        delete bytesStorage[_key];
    }

    function deleteBool(bytes32 _key) onlyLatestVersion external {
        delete boolStorage[_key];
    }

    function deleteInt(bytes32 _key) onlyLatestVersion external {
        delete intStorage[_key];
    }
}
