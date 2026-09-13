#!/usr/bin/env bash
set -euo pipefail

URL="0.0.0.0:$(head config.py -n 1 | cut -c 3-)"

cd "$(dirname "$0")"
# Create venv if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv ".venv"
fi
source ".venv/bin/activate"

echo "Installing dependencies..."
pip install requests flask flask-limiter Pillow gunicorn

echo "Starting app on $URL"
exec gunicorn --bind "$URL" --workers 3 \
    --access-logfile - --error-logfile - \
    main:app

