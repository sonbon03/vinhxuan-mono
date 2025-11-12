#!/bin/bash

###############################################################################
# RSA Key Pair Generation Script
#
# This script generates RSA key pairs for JWT token signing and verification
# using RSA256 asymmetric encryption algorithm.
#
# Security Benefits:
# - More secure than symmetric HS256 algorithm
# - Private key signs tokens (kept secure on server)
# - Public key verifies tokens (can be shared safely)
# - Prevents token forgery even if public key is compromised
#
# Usage:
#   chmod +x scripts/generate-rsa-keys.sh
#   ./scripts/generate-rsa-keys.sh
#
# Or via npm/yarn:
#   npm run keys:generate
#   yarn keys:generate
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Keys directory
KEYS_DIR="keys"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}RSA256 JWT Key Pair Generator${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if keys directory exists
if [ -d "$KEYS_DIR" ]; then
  echo -e "${YELLOW}Warning: Keys directory already exists!${NC}"
  echo -e "${YELLOW}This will overwrite existing keys.${NC}"
  read -p "Do you want to continue? (y/n): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Operation cancelled.${NC}"
    exit 1
  fi
else
  mkdir -p "$KEYS_DIR"
  echo -e "${GREEN}✓ Created keys directory${NC}"
fi

# Generate 4096-bit RSA private key
echo ""
echo "Generating 4096-bit RSA private key..."
openssl genrsa -out "$KEYS_DIR/jwt-private.key" 4096 2>/dev/null

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Private key generated: $KEYS_DIR/jwt-private.key${NC}"
else
  echo -e "${RED}✗ Failed to generate private key${NC}"
  exit 1
fi

# Extract public key from private key
echo "Extracting public key..."
openssl rsa -in "$KEYS_DIR/jwt-private.key" -pubout -out "$KEYS_DIR/jwt-public.key" 2>/dev/null

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Public key extracted: $KEYS_DIR/jwt-public.key${NC}"
else
  echo -e "${RED}✗ Failed to extract public key${NC}"
  exit 1
fi

# Set proper permissions
chmod 600 "$KEYS_DIR/jwt-private.key"
chmod 644 "$KEYS_DIR/jwt-public.key"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ RSA Key Pair Generated Successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Key Details:"
echo "  Private Key: $KEYS_DIR/jwt-private.key (permissions: 600)"
echo "  Public Key:  $KEYS_DIR/jwt-public.key (permissions: 644)"
echo ""
echo -e "${YELLOW}IMPORTANT SECURITY NOTES:${NC}"
echo "  1. Keep jwt-private.key secure and never commit to version control"
echo "  2. The keys directory is already in .gitignore"
echo "  3. Generate new keys for each environment (dev, staging, prod)"
echo "  4. Backup private key securely in production environments"
echo "  5. If private key is compromised, regenerate immediately"
echo ""
echo "Next Steps:"
echo "  1. Start the backend: npm run dev or yarn dev"
echo "  2. The application will automatically use these keys"
echo "  3. No additional configuration needed (uses default paths)"
echo ""
