#!/bin/bash

# exit upon any errors
set -e

# run puer as a local web server
puer . -p 8055 --no-reload --no-launch
echo "Now point your browser to http://localhost:8055/client/"
