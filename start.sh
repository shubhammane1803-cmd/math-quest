#!/bin/bash
set -e

echo "Installing dependencies..."
cd "math quest"
npm install

echo "Building application..."
npm run build

echo "Starting preview server..."
npm run preview -- --host 0.0.0.0 --port ${PORT:-5173}
