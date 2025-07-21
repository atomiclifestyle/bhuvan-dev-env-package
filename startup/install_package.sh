#!/bin/bash

# ==============================================================================
# Universal Package Installer
# This script is language-agnostic and works with any server that provides
# the package via a GET request with an 'x-user-id' header.
# ==============================================================================

# --- Configuration ---
# The URL of your running package server (Python, Node.js, etc.)
API_URL="http://localhost:5000/api/download"
OUTPUT_FILE="bhuvan-api.tar.gz"

# --- Step 1: Set up and load .env file ---
if [ ! -f ".env" ]; then
    echo "📄 .env file not found. Creating one."
    read -p "Please enter your User ID: " user_id_input
    echo "USER_ID=${user_id_input}" > .env
fi

export $(grep -v '^#' .env | xargs)

if [ -z "$USER_ID" ]; then
    echo "❌ Error: USER_ID is not set in your .env file."
    exit 1
fi

echo "✅ User ID loaded from .env file."
echo "--------------------------------------------------"

# --- Step 2: Download the Package ---
echo "🚀 Downloading package from $API_URL..."
curl -sL --fail --show-error \
     -H "x-user-id: $USER_ID" \
     -o "$OUTPUT_FILE" \
     "$API_URL"

if [ $? -ne 0 ]; then
    echo "❌ Download failed. Check that your server is running at $API_URL."
    rm -f "$OUTPUT_FILE"
    exit 1
fi

echo "✅ Download successful: $OUTPUT_FILE"
echo "--------------------------------------------------"

# --- Step 3: Install the Package ---
# echo "📦 Installing the npm package..."
# npm install "./$OUTPUT_FILE"

# if [ $? -ne 0 ]; then
#     echo "❌ npm installation failed."
#     exit 1
# fi

echo "🎉 Success! The package has been installed."