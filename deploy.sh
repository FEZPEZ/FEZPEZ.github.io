#!/bin/bash
set -e  # Exit if any command fails

# Go to the site root
cd "$(dirname "$0")"

# Add all changes
git add .

# Commit with an optional message argument, or default message
if [ -n "$1" ]; then
  git commit -m "$1"
else
  git commit -m "Update site"
fi

# Push to the main branch
git push origin main

echo "✅ Site pushed successfully."
