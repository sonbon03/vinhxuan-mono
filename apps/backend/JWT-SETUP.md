# JWT RSA256 Setup Guide

This project uses **RSA256 asymmetric encryption** for JWT tokens, which is more secure than symmetric algorithms like HS256.

## Quick Setup

### Option 1: Environment Variables (Recommended for Production)

1. **Generate keys:**
   ```bash
   cd apps/backend
   ./scripts/generate-env-keys.sh
   ```

2. **Copy the output** and add to your `.env` file:
   ```bash
   # Example output (your keys will be different)
   JWT_PRIVATE_KEY=base64:LS0tLS1CRUdJTi...
   JWT_PUBLIC_KEY=base64:LS0tLS1CRUdJTi...
   ```

3. **Start the server:**
   ```bash
   yarn dev
   ```

### Option 2: File-based Keys (Fallback)

If you don't set environment variables, the system will try to load from files:

```bash
# Generate key files
cd apps/backend
mkdir -p keys
openssl genrsa -out keys/jwt-private.key 4096
openssl rsa -in keys/jwt-private.key -pubout -out keys/jwt-public.key
```

## Environment Variables

### Required (if not using files):
```bash
JWT_PRIVATE_KEY=base64:...    # Private key for signing tokens
JWT_PUBLIC_KEY=base64:...     # Public key for verifying tokens
```

### Optional:
```bash
JWT_ACCESS_EXPIRY=1d          # Access token expiration (default: 1 day)
JWT_REFRESH_EXPIRY=7d         # Refresh token expiration (default: 7 days)
```

## Key Formats

The system supports two formats:

### 1. Base64 Encoded (Recommended)
```bash
JWT_PRIVATE_KEY=base64:LS0tLS1CRUdJTi...
JWT_PUBLIC_KEY=base64:LS0tLS1CRUdJTi...
```

**Benefits:**
- No issues with newlines in .env files
- Easy to copy/paste
- Works well with cloud platforms (Railway, Vercel, AWS, etc.)

### 2. Raw PEM Format
```bash
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIJ...\n-----END PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIB...\n-----END PUBLIC KEY-----"
```

**Note:** Use `\\n` for newlines in .env files.

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│                   JWT Flow with RSA256                  │
└─────────────────────────────────────────────────────────┘

1. User Login
   ↓
2. Server signs JWT with PRIVATE KEY (RSA256)
   ↓
3. Client receives JWT token
   ↓
4. Client sends JWT in Authorization header
   ↓
5. Server verifies JWT with PUBLIC KEY
   ↓
6. Access granted if valid
```

## Security Benefits of RSA256

✅ **More Secure:** Asymmetric encryption vs symmetric
✅ **Token Forgery Prevention:** Only private key can sign tokens
✅ **Public Key Can Be Shared:** Safe to expose for verification
✅ **Industry Standard:** Used by Google, GitHub, AWS, etc.
✅ **Microservices Ready:** Public key can be shared across services

## For Different Environments

### Development (.env)
```bash
# Generate once and commit to .env.example (without actual keys)
JWT_PRIVATE_KEY=base64:...
JWT_PUBLIC_KEY=base64:...
```

### Production (Cloud Platform)

**Railway:**
```bash
railway variables set JWT_PRIVATE_KEY=base64:...
railway variables set JWT_PUBLIC_KEY=base64:...
```

**Vercel (for serverless functions):**
```bash
vercel env add JWT_PRIVATE_KEY
vercel env add JWT_PUBLIC_KEY
```

**AWS / Docker:**
Set as environment variables in your deployment configuration.

## Troubleshooting

### Error: "RSA keys not found"

**Solution 1:** Set environment variables
```bash
# Generate keys
./scripts/generate-env-keys.sh

# Add to .env
JWT_PRIVATE_KEY=base64:...
JWT_PUBLIC_KEY=base64:...
```

**Solution 2:** Generate key files
```bash
cd apps/backend
mkdir -p keys
openssl genrsa -out keys/jwt-private.key 4096
openssl rsa -in keys/jwt-private.key -pubout -out keys/jwt-public.key
```

### Error: "Invalid token signature"

**Possible causes:**
- Private and public keys don't match
- Keys were regenerated but old tokens still in use
- Environment variables not properly set

**Solution:**
- Regenerate both keys together
- Clear all existing tokens/sessions
- Restart the server

### Error: "Unexpected token in JSON"

**Cause:** Newlines in .env file not properly escaped

**Solution:** Use base64 encoding instead:
```bash
# Convert to base64
./scripts/generate-env-keys.sh
# Choose option 1 (Base64 encoded)
```

## Best Practices

1. ✅ **Use environment variables** for production
2. ✅ **Use base64 encoding** to avoid newline issues
3. ✅ **Different keys per environment** (dev, staging, prod)
4. ✅ **Rotate keys periodically** (every 6-12 months)
5. ✅ **Store production keys securely** (AWS Secrets Manager, etc.)
6. ❌ **Never commit private keys** to version control
7. ❌ **Never share private keys** publicly
8. ❌ **Never use the same keys** across environments

## Scripts

| Script | Purpose |
|--------|---------|
| `./scripts/generate-env-keys.sh` | Generate keys formatted for .env |
| `./scripts/generate-rsa-keys.sh` | Generate key files (legacy) |

## References

- [JWT.io - RS256 Algorithm](https://jwt.io/)
- [OWASP - JWT Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [OpenSSL Documentation](https://www.openssl.org/docs/)

---

**Last Updated:** November 14, 2025
**Version:** 2.0 (Environment Variables Support)
