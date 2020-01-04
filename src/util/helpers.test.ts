/**
 * @jest-environment node
 */

import EthCrypto from 'eth-crypto';
import Web3 from "web3";
const TruffleContract = require("@truffle/contract");

import {
  createEncryptedSharedKey,
  addUser,
  addSecret,
  getSecret
} from "./helpers";

const Delegate = TruffleContract(require("../../build/contracts/KeyValueDelegate.json"));
const Proxy = TruffleContract(require("../../build/contracts/KeyValueProxy.json"));
const Storage = TruffleContract(require("../../build/contracts/KeyValueStore.json"));

const provider = require("ganache-cli").provider();
const web3 = new Web3(provider);

const identity = EthCrypto.createIdentity();
const identity2 = EthCrypto.createIdentity();

let owner;
let newUser;

let contract;

const secretName = "mysecret";
const secretValue = "secret"

beforeAll(async () => {
  Delegate.setProvider(provider);
  Proxy.setProvider(provider);
  Storage.setProvider(provider);
  const accounts = await web3.eth.getAccounts();
  owner = accounts[0];
  newUser = accounts[1];
});

it("can create a new sharedKey", async () => {
  const store = await Storage.new({from: owner});
  const delegate = await Delegate.new({from: owner});
  const sharedKey = await createEncryptedSharedKey(identity);
  const proxy = await Proxy.new(store.address, Buffer.from(JSON.stringify(sharedKey)), {from: owner});

  await store.upgradeVersion(proxy.address, {from: owner});
  await proxy.upgradeTo("0.1", delegate.address, {from: owner});
  contract = await Delegate.at(proxy.address);
});


it("can add a new user", async () => {
  await addUser(contract, newUser, identity2.publicKey, owner, identity.privateKey);
});

it("can add a new secret", async () => {
  await addSecret(contract, secretName, secretValue, owner, identity.privateKey);
});

it("can get our secret", async () => {
  const secret = await getSecret(contract, secretName, owner, identity.privateKey);
  expect(secret).toBe(secretValue);
});

it("can get our secret from another User", async () => {
  const secret = await getSecret(contract, secretName, newUser, identity2.privateKey);
  expect(secret).toBe(secretValue);
});
