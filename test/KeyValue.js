const assertRevert = require("./support/assertRevert");

const KeyValueDelegate = artifacts.require("KeyValueDelegate");
const colors = require("colors");

contract("KeyValueStore", async accounts => {
  let contract;

  const owner = accounts[0];
  const otherUser = accounts[1];

  before(async function() {
    contract = await KeyValueDelegate.deployed();
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

    it("existing user can add another user", async () => {
      await contract.authorizeUser(otherUser, Buffer.from("1"),
          { from: owner }
      );
    });

    it("can list authorized users", async () => {
      let res = await contract.listUsers();
      assert.equal(res.length, 2);
      assert.equal(res[0], owner);
      assert.equal(res[1], otherUser);
    });

    it("existing user can remove another user", async () => {
      await contract.removeUser(otherUser,
          { from: owner }
      );
      let res = await contract.listUsers();
      assert.equal(res.length, 2); // length stays the same, unfortunately.
      assert.equal(res[0], owner);
      assert.equal(res[1], "0x0000000000000000000000000000000000000000");
    });
  });
});
