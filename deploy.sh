#!/bin/bash
echo "██╗   ██╗████████╗██████╗  █████╗ ███╗   ██╗███████╗███████╗███████╗██████╗"
echo "██║   ██║╚══██╔══╝██╔══██╗██╔══██╗████╗  ██║██╔════╝██╔════╝██╔════╝██╔══██╗"
echo "██║   ██║   ██║   ██████╔╝███████║██╔██╗ ██║███████╗█████╗  █████╗  ██████╔╝"
echo "██║   ██║   ██║   ██╔══██╗██╔══██║██║╚██╗██║╚════██║██╔══╝  ██╔══╝  ██╔══██╗"
echo "╚██████╔╝   ██║   ██║  ██║██║  ██║██║ ╚████║███████║██║     ███████╗██║  ██║"
echo " ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝"

# Set the stage from the first argument or default to 'dev'
export MS_STAGE=${1:-dev}
export FUNCTION_NAME=${2:-""}

# Echo the stage to verify
echo ":: Development by NutriPlan Pro"
echo ":: Deploying to stage: $MS_STAGE"
echo ":: Ms-sandbox"

# Deploy with serverless
if [ -z "$FUNCTION_NAME" ]; then
    serverless deploy --stage $MS_STAGE
else
    serverless deploy function --function $FUNCTION_NAME --stage $MS_STAGE
fi
