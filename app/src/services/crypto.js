import * as openpgp from 'openpgp';

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


async function generateECCKey(name, email, passphrase)
{
    return await openpgp.generateKey({
        type: 'ecc',
        curve: 'curve25519',
        userIDs: [{ name, email }],
        passphrase
    });
}

async function generatePGPKey(name, email, passphrase) {
    return await openpgp.generateKey({
        type: 'rsa',
        rsaBits: 4096,
        userIDs: [{ name, email }],
        passphrase
    });
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
    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
        passphrase
    });

    const message = await openpgp.readMessage({
        armoredMessage: encryptedMessage
    });

    const { data: decrypted } = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
    });
    return decrypted;
}

export {
    bytesToUtf8,
    utf8ToBytes,
    generateECCKey,
    generatePGPKey,
    encryptMessage,
    decryptMessage
};
