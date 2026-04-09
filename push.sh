#!/bin/bash
# Run this script AFTER creating the repo on GitHub (step 1 below)
# Usage: bash push.sh

set -e

REPO_URL="https://github.com/rayanebenabs/SNOMI.git"
# ↑ Change this to your actual GitHub repo URL if different

cd "$(dirname "$0")"

echo "→ Initialising git..."
git init
git add .
git commit -m "Initial commit — SNOMI v1.1"

echo "→ Pushing to GitHub..."
git branch -M main
git remote add origin "$REPO_URL"
git push -u origin main

echo ""
echo "✅ Done! Now go to GitHub:"
echo "   Settings → Pages → Source: GitHub Actions"
echo "   The site will deploy automatically on every push."
