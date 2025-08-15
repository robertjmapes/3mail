
function bytesToUtf8(bytes) {
    if (bytes instanceof Uint8Array) {
        return new TextDecoder().decode(bytes);
    }
    if (Array.isArray(bytes)) {
        return new TextDecoder().decode(new Uint8Array(bytes));
    }
    throw new Error("Unsupported byte format");
}

// Generate a new PGP keypair before deploying
async function generateECCKey(name, email, passphrase) 
{
    const key = await openpgp.generateKey({
        type: 'ecc',                 // ECC key
        curve: 'curve25519',         // Recommended curve for encryption
        userIDs: [{ name, email }],  // Name and email
        passphrase                   // Optional passphrase
    });

    return {
        publicKey: key.publicKeyArmored,   // Armored public key
        privateKey: key.privateKeyArmored  // Armored private key
    };
}

// PGP