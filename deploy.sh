#!/bin/bash
echo "██╗   ██╗████████╗██████╗  █████╗ ███╗   ██╗███████╗███████╗███████╗██████╗"
echo "██║   ██║╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██╔════╝██╔════╝██╔══██╗"
echo "██║   ██║   ██║   ██████╔╝███████║██╔██╗ ██║███████╗█████╗  █████╗  ██████╔╝"
echo "██║   ██║   ██║   ██╔══██╗██╔══██║██║╚██╗██║╚════██║██╔══╝  ██╔══╝  ██╔══██╗"
echo "╚██████╔╝   ██║   ██║  ██║██║  ██║██║ ╚████║███████║██║     ███████╗██║  ██║"
echo " ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝"

# Set the stage from the first argument or default to 'dev'
export MS_STAGE=${1:-dev}

# Echo the stage to verify
echo ":: Development by VIRTUS PROJECT"
echo ":: Deploying to stage: $MS_STAGE"
echo ":: Ms-sandbox"

# Deploy with serverless
serverless deploy --stage $MS_STAGE