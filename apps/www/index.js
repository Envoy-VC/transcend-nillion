// @ts-nocheck
import threshold from '@celo/blind-threshold-bls';
import crypto from 'node:crypto';

const msg = Buffer.from('hello world');
const userSeed = Uint8Array.from(
  Buffer.from(
    '5eG7hhPtryS6fakBxwqr4RzB75yKD1pKjSAysqbV5z4BN4t8NLEiCUieyRNzL7ASQqeCMuPiQ13cedtDxvka5w1V'
  )
);

// Blind the message
const blinded = threshold.blind(msg, crypto.randomBytes(32));
const blindedMessage = blinded.message;

// Generate the secret shares for a 3-of-4 threshold scheme
const t = 3;
const n = 4;
const keys = threshold.thresholdKeygen(n, t, crypto.randomBytes(32));

console.log(`
Threshold Public Key: ${Buffer.from(keys.thresholdPublicKey).toString('hex')}

Shares: \n${Array(n)
  .fill(true)
  .map((_, i) => Buffer.from(keys.getShare(i)).toString('hex'))
  .join('\n')}

`);
const polynomial = keys.polynomial;

// each of these shares proceed to sign teh blinded sig
let sigs = [];
for (let i = 0; i < keys.numShares(); i++) {
  const sig = threshold.partialSignBlindedMessage(
    keys.getShare(i),
    blindedMessage
  );
  sigs.push(sig);
}

// The combiner will verify all the individual partial signatures
for (const sig of sigs) {
  threshold.partialVerifyBlindSignature(polynomial, blindedMessage, sig);
}

const blindSig = threshold.combine(t, flattenSigsArray(sigs));

// User unblinds the combined threshold signature with his scalar
const sig = threshold.unblind(blindSig, blinded.blindingFactor);

// User verifies the unblinded signautre on his unblinded message
threshold.verify(keys.thresholdPublicKey, msg, sig);
console.log('Verification successful');

function flattenSigsArray(sigs) {
  return Uint8Array.from(
    sigs.reduce(function (a, b) {
      return Array.from(a).concat(Array.from(b));
    }, [])
  );
}
