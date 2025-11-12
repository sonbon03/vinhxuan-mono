# RSA Keys Directory

This directory contains the RSA key pair used for JWT token signing and verification with RSA256 algorithm.

## Key Files

- **jwt-private.key**: RSA private key (4096-bit) used to **sign** JWT tokens
- **jwt-public.key**: RSA public key extracted from private key used to **verify** JWT tokens

## Security Implementation

### RSA256 Asymmetric Encryption

The application uses **RSA256** (RSA Signature with SHA-256) for JWT authentication, which provides several security advantages over symmetric HS256:

**Benefits:**
- ✅ **Asymmetric Cryptography**: Different keys for signing and verification
- ✅ **Enhanced Security**: Private key never leaves the server
- ✅ **Token Forgery Prevention**: Impossible to create valid tokens without private key
- ✅ **Public Key Distribution**: Public key can be safely shared for verification
- ✅ **Industry Standard**: Recommended for microservices and distributed systems
- ✅ **Key Rotation**: Easier to rotate keys without affecting all services

**How It Works:**
1. **Token Signing** (Authentication):
   - Server uses `jwt-private.key` to sign JWT tokens
   - Token contains user claims (id, email, role, etc.)
   - Private key ensures only authorized server can create valid tokens

2. **Token Verification** (Authorization):
   - Server uses `jwt-public.key` to verify token signatures
   - Validates token hasn't been tampered with
   - Checks expiration, issuer, and audience claims

3. **Security Guarantee**:
   - Even if attacker obtains public key, they cannot forge tokens
   - Only entity with private key can create valid signed tokens
   - Cryptographically secure against tampering

## Key Generation

### Automatic Generation (Recommended)

Run the provided script to generate new keys:

```bash
# From backend directory
npm run keys:generate
# or
yarn keys:generate

# Or run script directly
./scripts/generate-rsa-keys.sh
```

### Manual Generation

If you prefer to generate keys manually:

```bash
# Generate 4096-bit RSA private key
openssl genrsa -out keys/jwt-private.key 4096

# Extract public key from private key
openssl rsa -in keys/jwt-private.key -pubout -out keys/jwt-public.key

# Set proper permissions
chmod 600 keys/jwt-private.key  # Read/write for owner only
chmod 644 keys/jwt-public.key   # Read for everyone
```

## Key Management Best Practices

### Development Environment
- ✅ Generate keys once per developer machine
- ✅ Keys stored locally in `keys/` directory
- ❌ **NEVER** commit keys to version control
- ✅ Directory already added to `.gitignore`

### Production Environment
- ✅ Generate unique keys for each environment (staging, production)
- ✅ Store keys securely (e.g., AWS Secrets Manager, HashiCorp Vault)
- ✅ Use environment variables for custom key paths
- ✅ Rotate keys periodically (every 90-180 days)
- ✅ Backup private key in secure encrypted storage
- ✅ Monitor for unauthorized access attempts

### Key Rotation Process
1. Generate new RSA key pair
2. Keep old public key for verification (grace period)
3. Start signing new tokens with new private key
4. After grace period (e.g., 7 days), remove old key
5. All active tokens will need to re-authenticate

### Security Warnings

⚠️ **CRITICAL SECURITY RULES**:
1. **NEVER** commit `jwt-private.key` to version control
2. **NEVER** share private key via email, chat, or insecure channels
3. **NEVER** store private key in frontend code or client applications
4. **ALWAYS** use `.gitignore` to exclude keys directory
5. **ALWAYS** set restrictive file permissions (600) on private key
6. **ALWAYS** regenerate keys if private key is compromised
7. **ALWAYS** use different keys for different environments

### What to Do If Private Key Is Compromised

If you suspect the private key has been compromised:

1. **Immediate Actions**:
   ```bash
   # Generate new key pair immediately
   ./scripts/generate-rsa-keys.sh

   # Restart the application to use new keys
   npm run dev
   ```

2. **Force Re-authentication**:
   - All existing JWT tokens will become invalid
   - Users will need to log in again
   - This is the desired behavior for security

3. **Investigation**:
   - Review access logs for suspicious activity
   - Check for unauthorized token generation
   - Audit recent authentication attempts

4. **Prevention**:
   - Review file permissions
   - Audit server access
   - Implement additional monitoring

## Custom Key Locations

By default, the application looks for keys in this directory. To use custom locations, set environment variables:

```bash
# In .env file
JWT_PRIVATE_KEY_PATH=/secure/location/jwt-private.key
JWT_PUBLIC_KEY_PATH=/secure/location/jwt-public.key
```

## Verification

To verify your keys are properly generated:

```bash
# View private key (should show RSA PRIVATE KEY header)
head -n 1 keys/jwt-private.key
# Expected: -----BEGIN RSA PRIVATE KEY-----

# View public key (should show PUBLIC KEY header)
head -n 1 keys/jwt-public.key
# Expected: -----BEGIN PUBLIC KEY-----

# Check key permissions
ls -la keys/
# Expected:
#   -rw------- jwt-private.key (600)
#   -rw-r--r-- jwt-public.key  (644)

# Verify key pair matches
openssl rsa -in keys/jwt-private.key -pubout | diff - keys/jwt-public.key
# Expected: No output (keys match)
```

## Troubleshooting

### Error: "RSA keys not found"
**Solution**: Run key generation script:
```bash
npm run keys:generate
```

### Error: "Permission denied reading private key"
**Solution**: Fix file permissions:
```bash
chmod 600 keys/jwt-private.key
```

### Error: "Invalid signature" when verifying tokens
**Possible Causes**:
1. Keys were regenerated after tokens were issued
2. Using different keys in different environments
3. Private and public keys don't match

**Solution**: Regenerate keys and restart:
```bash
./scripts/generate-rsa-keys.sh
npm run dev
```

## Technical Specifications

- **Algorithm**: RSA256 (RSA Signature with SHA-256)
- **Key Size**: 4096 bits (extremely secure)
- **Format**: PEM (Privacy Enhanced Mail) format
- **Private Key**: PKCS#1 RSA Private Key format
- **Public Key**: X.509 SubjectPublicKeyInfo format
- **Token Standard**: JWT (JSON Web Token) - RFC 7519
- **Claims**: iss (issuer), aud (audience), exp (expiration), sub (subject)

## Additional Resources

- [JWT.io - Introduction to JWT](https://jwt.io/introduction)
- [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)
- [RFC 7518 - JSON Web Algorithms (JWA)](https://tools.ietf.org/html/rfc7518)
- [OWASP - JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)

---

**Last Updated**: November 11, 2025
**Maintained By**: Vinh Xuan Development Team
