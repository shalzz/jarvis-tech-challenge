export default interface IKeyValueDelegate {
  authorizeUser(user: string, encryptedSharedKey: Buffer, opts?: any);
  removeUser(user: string, opts?: any): Promise<void>;
  addSecret(name: Buffer, value: Buffer): Promise<void>;
  getEncSharedKey(user: string): Promise<void>;
}
