#!/bin/sh
set -e

# If provided, materialize the service account file
if [ -n "$FIREBASE_SERVICE_ACCOUNT_BASE64" ]; then
  echo "$FIREBASE_SERVICE_ACCOUNT_BASE64" | base64 -d > /tmp/firebase.json
  export GOOGLE_APPLICATION_CREDENTIALS=/tmp/firebase.json
fi

exec "$@"
