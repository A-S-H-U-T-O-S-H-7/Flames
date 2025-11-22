// This is a simple hash function for demo
// In production, use: npm install bcryptjs

export const simpleHash = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const verifyPassword = async (password, hashedPassword) => {
  const testHash = await simpleHash(password);
  return testHash === hashedPassword;
};