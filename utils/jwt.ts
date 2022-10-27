import { create, getNumericDate, Header, Payload, verify } from '../deps.ts';

const encoder = new TextEncoder();

// TODO comment for crypto
async function generateKey(secretKey: string) {
  const keyBuf = encoder.encode(secretKey);
  return await crypto.subtle.importKey(
    'raw',
    keyBuf,
    { name: 'HMAC', hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  );
}

// TODO comment
export async function signJwt({
  userId,
  expiresIn,
  secretKey,
}: {
  userId: string;
  expiresIn: number;
  secretKey: string;
}) {
  const payload: Payload = {
    iss: 'example.com',
    sub: userId,
    exp: getNumericDate(expiresIn * 60),
    iat: getNumericDate(new Date()),
    nbf: getNumericDate(new Date()),
  };

  const header: Header = {
    alg: 'HS256',
  };

  const key = await generateKey(secretKey);

  return create(header, payload, key);
}

export async function verifyJwt(
  token: string,
  secretKey: string
): Promise<Payload> {
  try {
    const key = await generateKey(secretKey);
    return await verify(token, key);
  } catch (err) {
    return err.message;
  }
}
