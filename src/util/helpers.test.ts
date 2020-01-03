import EthCrypto from 'eth-crypto';
import TruffleContract from "truffle-contract";
import Web3 from "web3";

import {createEncryptedSharedKey} from "./helpers";


const Delegate = TruffleContract(require("../../build/contracts/KeyValueDelegate.json"));
const Proxy = TruffleContract(require("../../build/contracts/KeyValueProxy.json"));
const Storage = TruffleContract(require("../../build/contracts/KeyValueStore.json"));

const provider = require("ganache-cli").provider();
const web3 = new Web3(provider);

const identity = EthCrypto.createIdentity();
let accounts;

beforeAll(async () => {
  Delegate.setProvider(provider);
  Proxy.setProvider(provider);
  Storage.setProvider(provider);
  accounts = await web3.eth.getAccounts();
});

it("can create a new sharedKey", async () => {
  const store = await Storage.new({from: accounts[0]});
  const delegate = await Delegate.new({from: accounts[0]});
  const sharedKey = createEncryptedSharedKey(identity);
  const proxy = await Proxy.new(store.address, sharedKey, {from: accounts[0]});

  await store.upgradeVersion(proxy.address, {from: accounts[0]});
  await proxy.upgradeTo("0.1", delegate.address, {from: accounts[0]});
});
