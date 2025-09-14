import forge from 'node-forge';
// import { Buffer } from 'buffer';

// This helper function cleans the key from the .env file
function formatPemKey(rawKey: string, type: 'PUBLIC KEY' | 'RSA PRIVATE KEY'): string {
    if (!rawKey) throw new Error(`Key of type ${type} is missing.`);
    if (rawKey.startsWith('"')) rawKey = rawKey.substring(1, rawKey.length - 1).replace(/\\n/g, '\n');
    const header = `-----BEGIN ${type}-----`;
    const footer = `-----END ${type}-----`;
    if (rawKey.startsWith(header)) return rawKey;
    const keyBody = rawKey.replace(/\s/g, '');
    const lines = keyBody.match(/.{1,64}/g)?.join('\n') || '';
    return `${header}\n${lines}\n${footer}`;
}

const POLICE_PUBLIC_KEY_PEM = import.meta.env.VITE_POLICE_PUBLIC_KEY;

// This is the hybrid encryption function we designed earlier
export function encryptHybrid(data: object, publicKeyPem: string): string {
  const jsonData = JSON.stringify(data);
  const aesKey = forge.random.getBytesSync(32); // 256-bit key
  const iv = forge.random.getBytesSync(16);

  const cipher = forge.cipher.createCipher('AES-CBC', aesKey);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(jsonData, 'utf8'));
  cipher.finish();
  const encryptedData = cipher.output.getBytes();

  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encryptedKey = publicKey.encrypt(aesKey, 'RSA-OAEP');
  
  const pkg = {
    encryptedKey: forge.util.encode64(encryptedKey),
    iv: forge.util.encode64(iv),
    encryptedData: forge.util.encode64(encryptedData),
  };
  // Return the package as a JSON string for the backend
  return JSON.stringify(pkg);
}

export function getPolicePublicKey(): string {
    if (!POLICE_PUBLIC_KEY_PEM) {
        throw new Error("VITE_POLICE_PUBLIC_KEY is not defined in your .env file.");
    }
    return formatPemKey(POLICE_PUBLIC_KEY_PEM, 'PUBLIC KEY');
}