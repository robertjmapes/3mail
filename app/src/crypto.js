import * as openpgp from 'openpgp';

// Convert UTF-8 string to hex string
export function utf8ToHex(str)
{
    const bytes = new TextEncoder().encode(str); // UTF-8 encode
    return '0x' + Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Convert hex string (with or without 0x) back to UTF-8 string
export function hexToUtf8(hex)
{
    if (hex.startsWith('0x')) hex = hex.slice(2);
    const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
    return new TextDecoder().decode(bytes);
}

function utf8ToBytes(str) 
{
    return new TextEncoder().encode(str);
}

function bytesToUtf8(bytes) {
    // If it's a hex string like '0x68656c6c6f', convert to byte array
    if (typeof bytes === 'string' && bytes.startsWith('0x')) {
        bytes = bytes.slice(2); // remove '0x'
        const byteArray = [];
        for (let i = 0; i < bytes.length; i += 2) {
            byteArray.push(parseInt(bytes.substr(i, 2), 16));
        }
        bytes = new Uint8Array(byteArray);
    } 
    // If it's already an array of numbers, convert to Uint8Array
    else if (Array.isArray(bytes)) {
        bytes = new Uint8Array(bytes);
    } 
    // Otherwise, assume it's already a Uint8Array

    const decoder = new TextDecoder();
    return decoder.decode(bytes);
}

export function hexToBytes(hex)
{
    if (hex.startsWith("0x")) hex = hex.slice(2);
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.slice(i*2, i*2+2), 16);
    }
    return bytes;
  }


async function generatePGPKey(name, email, passphrase)
{
    return await openpgp.generateKey({
        type: 'ecc',
        curve: 'curve25519',
        userIDs: [{ name, email }],
        passphrase
    });
}

async function hexToPGPArmored(hexKey)
{
    if (hexKey.startsWith('0x')) {
        hexKey = hexKey.slice(2);
    }
    const binaryKey = Uint8Array.from(Buffer.from(hexKey, 'hex'));

    const packetlist = openpgp.packet.List.fromBytes(binaryKey);
    const publicKey = new openpgp.PublicKey(packetlist);

    return publicKey.armor();
}

async function encryptMessage(publicKeyArmored, message)
{
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    return await openpgp.encrypt({
        message: await openpgp.createMessage({ text: message }),
        encryptionKeys: publicKey
    });
}


async function decryptMessage(privateKeyArmored, passphrase, encryptedMessage)
{
    try
    {
        // Read the armored private key
        let privateKeyObj = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });

        // Decrypt it if a passphrase is provided
        if (passphrase) {
            privateKeyObj = await openpgp.decryptKey({
                privateKey: privateKeyObj,
                passphrase
            });
        }

        // Read the encrypted message
        const message = await openpgp.readMessage({ armoredMessage: encryptedMessage });

        // Decrypt the message using the Key object
        const { data: decrypted } = await openpgp.decrypt({
            message,
            decryptionKeys: privateKeyObj
        });

        return decrypted;
    }
    catch (err)
    {
        return 'Could not decrypt message!';
    }
}


export {
    bytesToUtf8,
    utf8ToBytes,
    generatePGPKey,
    hexToPGPArmored,
    encryptMessage,
    decryptMessage
};
