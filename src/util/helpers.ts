import EthCrypto from 'eth-crypto';
import CryptoJS from "crypto-js";

export const createEncryptedSharedKey =
  async (identity) => {
    const sharedKey = "random";
    const encryptedSharedKey = await EthCrypto.encryptWithPublicKey(identity.publicKey, sharedKey);
    return encryptedSharedKey;
}


export const addUser =
  async (contract, newUserAddress, newUserPublicKey, existingUserAddress, existingUserPrivateKey) => {
    const encBytes = await contract.getEncSharedKey(
      existingUserAddress,
     {from: existingUserAddress}
    );
    const encryptedSharedKey = JSON.parse(Buffer.from(encBytes.substring(2), "hex").toString());

    const sharedKey = await EthCrypto.decryptWithPrivateKey(existingUserPrivateKey, encryptedSharedKey);
    const newUserEncryptedSharedKey = await EthCrypto.encryptWithPublicKey(newUserPublicKey, sharedKey);
    const bytes = Buffer.from(JSON.stringify(newUserEncryptedSharedKey));

    // TODO: must fail if address exists already:
    await contract.authorizeUser(newUserAddress, bytes, { from: existingUserAddress});
}

export const addSecret =
  async (contract, secretName, secretValue, myPublicAddress, myPrivateKey) => {
    const encBytes = await contract.getEncSharedKey(
      myPublicAddress,
     {from: myPublicAddress}
    );
    const encryptedSharedKey = JSON.parse(Buffer.from(encBytes.substring(2), "hex").toString());

    const sharedKey = await EthCrypto.decryptWithPrivateKey(myPrivateKey, encryptedSharedKey);
    const encryptedSecret = CryptoJS.AES.encrypt(secretValue, sharedKey);
    await contract
      .addSecret(Buffer.from(secretName), Buffer.from(encryptedSecret.toString()), {from: myPublicAddress})
}

export const getSecret =
  async (contract, secretName, myPublicAddress, myPrivateKey) => {
    const encBytes = await contract.getEncSharedKey(
      myPublicAddress,
     {from: myPublicAddress}
    );
    const encryptedSharedKey = JSON.parse(Buffer.from(encBytes.substring(2), "hex").toString());
    const sharedKey = await EthCrypto.decryptWithPrivateKey(myPrivateKey, encryptedSharedKey);

    const bytes = await contract.getSecret(Buffer.from(secretName), {from: myPublicAddress});
    const encryptedSecret = Buffer.from(bytes.substring(2), "hex").toString();
    const secret = CryptoJS.AES.decrypt(encryptedSecret, sharedKey);
    const plaintext = secret.toString(CryptoJS.enc.Utf8);
    return plaintext;
}
