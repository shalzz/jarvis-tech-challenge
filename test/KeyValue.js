const colors = require("colors");

const assertRevert = require("./support/assertRevert");

const KeyValueDelegate = artifacts.require("KeyValueDelegate");
const KeyValueProxy = artifacts.require("KeyValueProxy");
const KeyValueStore = artifacts.require("KeyValueStore");

contract("KeyValueStore", async accounts => {
  let contract;

  const owner = accounts[0];
  const otherUser = accounts[1];

  before(async function() {
    let proxy = await KeyValueProxy.deployed();
    contract = await KeyValueDelegate.at(proxy.address);
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
      let res = await contract.authorizeUser(otherUser, Buffer.from("1"),
          { from: owner }
      );
      assert.equal(res.logs[0].event, "Authorized");
    });

    it("existing user can remove another user", async () => {
      let res = await contract.removeUser(otherUser,
          { from: owner }
      );
      assert.equal(res.logs[0].event, "Deauthorized");
    });
  });


  describe("Proxy ", () => {
    it("can upgrade", async () => {
      let newContract = await KeyValueDelegate.new();
      let proxy = await KeyValueProxy.deployed();
      proxy.upgradeTo("0.2", newContract.address);

      assert.equal(await proxy.version(), "0.2");
      assert.equal(await contract.getEncSharedKey(owner), "0x30");
    });
  });
});
