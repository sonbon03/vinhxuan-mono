#!/bin/bash

# Vinh Xuan CMS Backend - Cleanup Script
# This script stops and cleans up the development environment

set -e

echo "🧹 Vinh Xuan CMS Backend - Cleanup"
echo "=================================="
echo ""

# Parse arguments
REMOVE_VOLUMES=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --remove-data|-d)
            REMOVE_VOLUMES=true
            shift
            ;;
        --help|-h)
            echo "Usage: ./scripts/cleanup-dev.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -d, --remove-data    Remove all data (volumes)"
            echo "  -h, --help          Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Stop services
echo "🛑 Stopping Docker services..."
docker-compose down

if [ "$REMOVE_VOLUMES" = true ]; then
    echo ""
    echo "⚠️  WARNING: This will delete ALL data in PostgreSQL and Redis!"
    read -p "Are you sure? (yes/no): " confirmation

    if [ "$confirmation" = "yes" ]; then
        echo "🗑️  Removing volumes..."
        docker-compose down -v
        echo "✅ Volumes removed"
    else
        echo "❌ Cleanup cancelled"
        exit 0
    fi
fi

echo ""
echo "=================================="
echo "✅ Cleanup complete!"
echo ""
echo "To start again, run:"
echo "  ./scripts/setup-dev.sh"
echo "=================================="
