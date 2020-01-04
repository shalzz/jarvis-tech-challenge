import EthCrypto from 'eth-crypto';

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
    let encryptedSharedKey = JSON.parse(Buffer.from(encBytes.substring(2), "hex").toString());
    console.log(encryptedSharedKey);

    const sharedKey = await EthCrypto.decryptWithPrivateKey(existingUserPrivateKey, encryptedSharedKey);
    const newUserEncryptedSharedKey = await EthCrypto.encryptWithPublicKey(newUserPublicKey, sharedKey);
    const bytes = Buffer.from(JSON.stringify(newUserEncryptedSharedKey));

    // must fail if address exists already:
    await contract.authorizeUser(newUserAddress, bytes, { from: existingUserAddress});
}
