const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "fallback-secret";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function uint8ArrayToBase64url(arr: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSha256(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const dataBytes = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, dataBytes);
  return uint8ArrayToBase64url(new Uint8Array(signature));
}

function decodeBase64url(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
}

export function verifyPassword(password: string): boolean {
  if (!password || !ADMIN_PASSWORD) return false;
  return password === ADMIN_PASSWORD;
}

export async function createAdminToken(): Promise<string> {
  const payload = btoa(
    JSON.stringify({
      role: "admin",
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000,
    })
  )
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const signature = await hmacSha256(SESSION_SECRET, payload);
  return `${payload}.${signature}`;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [payload, signature] = parts;

    const expectedSig = await hmacSha256(SESSION_SECRET, payload);
    if (signature !== expectedSig) return false;

    const data = JSON.parse(decodeBase64url(payload));
    if (data.role !== "admin") return false;
    if (Date.now() > data.exp) return false;

    return true;
  } catch {
    return false;
  }
}
