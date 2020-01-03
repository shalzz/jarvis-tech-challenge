import EthCrypto from 'eth-crypto';

export const createEncryptedSharedKey =
  async (identity) => {
    const sharedKey = "random";
    const encryptedSharedKey = await EthCrypto.encryptWithPublicKey(identity.publicKey, sharedKey);
    return encryptedSharedKey;
}
