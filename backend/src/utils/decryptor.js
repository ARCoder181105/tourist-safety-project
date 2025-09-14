const forge = require('node-forge');

/**
 * Robustly cleans and formats a raw key string from a .env file into a valid PEM format.
 */
function formatPemKey(rawKey, type) {
    if (!rawKey) throw new Error(`Key of type ${type} is missing.`);
    if (rawKey.startsWith('"')) rawKey = rawKey.substring(1, rawKey.length - 1).replace(/\\n/g, '\n');
    const header = `-----BEGIN ${type}-----`;
    const footer = `-----END ${type}-----`;
    if (rawKey.startsWith(header)) return rawKey;
    const keyBody = rawKey.replace(/\s/g, '');
    const lines = keyBody.match(/.{1,64}/g)?.join('\n') || '';
    return `${header}\n${lines}\n${footer}`;
}

/**
 * Decrypts a hybrid-encrypted package.
 * @param {string} encryptedPackageString The stringified JSON of the encrypted package.
 * @param {string} privateKeyPem The PEM-formatted RSA private key.
 * @returns {object} The decrypted data object.
 */
exports.decryptHybrid = (encryptedPackageString, privateKeyPem) => {
  const encryptedPackage = JSON.parse(encryptedPackageString);
  const formattedPrivateKey = formatPemKey(privateKeyPem, 'RSA PRIVATE KEY');
  const privateKey = forge.pki.privateKeyFromPem(formattedPrivateKey);

  const aesKey = privateKey.decrypt(forge.util.decode64(encryptedPackage.encryptedKey), 'RSA-OAEP');
  
  const iv = forge.util.decode64(encryptedPackage.iv);
  const decipher = forge.cipher.createDecipher('AES-CBC', aesKey);
  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(forge.util.decode64(encryptedPackage.encryptedData)));
  decipher.finish();

  return JSON.parse(decipher.output.toString('utf8'));
};