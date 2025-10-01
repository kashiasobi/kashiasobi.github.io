#!/bin/bash
# This script navigates to the Vue project directory, installs dependencies, and starts the development server.

# Exit immediately if a command exits with a non-zero status.
set -e

# Define the project directory
PROJECT_DIR="@Vue"

# Check if the project directory exists
if [ ! -d "$PROJECT_DIR" ]; then
  echo "Error: Directory '$PROJECT_DIR' not found."
  exit 1
fi

# Navigate to the project directory
cd "$PROJECT_DIR"

# Install dependencies
echo "Installing dependencies..."
npm install

# Start the development server
echo "Starting the development server..."
npm run dev
