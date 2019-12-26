const KeyValueStore = artifacts.require("KeyValueStore");
const colors = require("colors");

contract("KeyValueStore", async accounts => {
  let contract;

  const owner = accounts[0];
  const otherUser = accounts[1];

  beforeEach(async function() {
    contract = await KeyValueStore.deployed("0x0adf");
  });

  describe("Store", () => {
    it("should return 0 when no tokens", async () => {
      let key = await contract.getEncSharedKey(owner);
      console.log("kye:  ", key);
      //assert.equal(await contract.getEncSharedKey(otherUser), 0);
    });
  });
});
