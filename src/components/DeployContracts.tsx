import * as React from "react";
import TruffleContract from "truffle-contract";
import Web3 from "web3";
//import {createEncryptedSharedKey} from "../util/helpers";

const Delegate = TruffleContract(require("../../build/contracts/KeyValueDelegate.json"));
const Proxy = TruffleContract(require("../../build/contracts/KeyValueProxy.json"));
const Storage = TruffleContract(require("../../build/contracts/KeyValueStore.json"));

interface IDeployContractsProps {
  web3: Web3;
}

interface IDeployContractsState {
  account: string;
  accountError: boolean;
  contractAddress: string;
}

export default class DeployContracts extends React.Component<IDeployContractsProps, IDeployContractsState> {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      accountError: false,
      contractAddress: "",
    };
  }

  public onDeploy = async (event) => {
    const accounts = await this.props.web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.setState({
        account: "",
        accountError: true,
      });
      return;
    }

    Delegate.setProvider(this.props.web3.currentProvider);
    Proxy.setProvider(this.props.web3.currentProvider);
    Storage.setProvider(this.props.web3.currentProvider);
    const account = accounts[0];
    let instance: any;

    try {
      const store = await Storage.new({from: account});
      const delegate = await Delegate.new({from: account});
      const proxy = await Proxy.new(store.address, Buffer.from("0"), {from: account});

      await store.upgradeVersion(proxy.address, {from: account});
      await proxy.upgradeTo("0.1", delegate.address, {from: account});
      instance = proxy;
    } catch (err) {
      console.error(err);
      alert(JSON.stringify(err));
      return;
    }

    this.setState({
      account: this.props.web3.eth.accounts[0],
      accountError: false,
      contractAddress: instance.address,
    });
    alert("Successfully Deployed!");
  }

  public render() {
    return (
    <div>
      <h3>Key Value Store</h3>
      <button onClick={this.onDeploy}>Deploy All Contracts</button>
      <p>Contract address: {this.state.contractAddress}</p>
      <p>Account: {this.state.accountError ? "No accounts found" : this.state.account}</p>
    </div>
    );
  }
}
