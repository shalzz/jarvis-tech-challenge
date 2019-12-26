const assertRevert = require("./support/assertRevert");

const KeyValueStore = artifacts.require("KeyValueStore");
const colors = require("colors");

contract("KeyValueStore", async accounts => {
  let contract;

  const owner = accounts[0];
  const otherUser = accounts[1];

  beforeEach(async function() {
    contract = await KeyValueStore.deployed();
  });

  describe("User auth", () => {
    it("can get the sharedKey of the owner", async () => {
      assert.equal(await contract.getEncSharedKey(owner), "0x30");
    });

    it("reverts on unauthorized user access", async () => {
      await assertRevert(
        contract.authorizeUser(otherUser, Buffer.from("1"),
          { from: otherUser }
        )
      );
    });
  });
});
