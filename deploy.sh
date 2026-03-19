#!/bin/bash
# Deploy script — triggered by GitHub webhook on each push
cd /var/www/rehabyou
git fetch origin main
git reset --hard origin/main
bash /var/www/rehabyou/generate-sitemap.sh
echo "Deploy complete: $(date)"
