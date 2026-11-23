#!/bin/bash
# ============================================
# VPS Deployment Script for jaipurelitehomes.com
# ============================================
# 
# Prerequisites:
# 1. DNS A record for jaipurelitehomes.com pointing to 82.197.93.185
# 2. DNS A record for www.jaipurelitehomes.com pointing to 82.197.93.185
#
# Run this script on the VPS after transferring files
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Deploying Jaipur Elite Homes${NC}"
echo -e "${GREEN}=========================================${NC}"

# Variables
APP_DIR="/var/www/jaipurelitehomes"
FRONTEND_PORT=3010
BACKEND_PORT=8010
DOMAIN="jaipurelitehomes.com"

# Step 1: Check port availability
echo -e "\n${YELLOW}Step 1: Checking port availability...${NC}"
if netstat -tuln | grep -q ":$FRONTEND_PORT "; then
    echo -e "${RED}ERROR: Port $FRONTEND_PORT is already in use!${NC}"
    exit 1
fi
if netstat -tuln | grep -q ":$BACKEND_PORT "; then
    echo -e "${RED}ERROR: Port $BACKEND_PORT is already in use!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Ports $FRONTEND_PORT and $BACKEND_PORT are available${NC}"

# Step 2: Create directory if not exists
echo -e "\n${YELLOW}Step 2: Setting up directory...${NC}"
mkdir -p $APP_DIR
cd $APP_DIR
echo -e "${GREEN}✓ Directory ready: $APP_DIR${NC}"

# Step 3: Setup Backend
echo -e "\n${YELLOW}Step 3: Setting up Backend...${NC}"
cd $APP_DIR/backend

# Copy production env
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo -e "${GREEN}✓ Production environment configured${NC}"
fi

# Install Python dependencies
pip3 install -r requirements_vps.txt
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Step 4: Setup Frontend
echo -e "\n${YELLOW}Step 4: Setting up Frontend...${NC}"
cd $APP_DIR/frontend

# Load Node.js via nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Copy production env
if [ -f ".env.production" ]; then
    cp .env.production .env.local
    echo -e "${GREEN}✓ Production environment configured${NC}"
fi

# Install dependencies and build
yarn install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

yarn build
echo -e "${GREEN}✓ Frontend built successfully${NC}"

# Step 5: Start with PM2
echo -e "\n${YELLOW}Step 5: Starting applications with PM2...${NC}"
cd $APP_DIR

# Stop existing instances if any
pm2 delete jaipurelitehomes-frontend 2>/dev/null || true
pm2 delete jaipurelitehomes-backend 2>/dev/null || true

# Start apps
pm2 start ecosystem.config.js
pm2 save

echo -e "${GREEN}✓ Applications started with PM2${NC}"

# Step 6: Setup Nginx
echo -e "\n${YELLOW}Step 6: Configuring Nginx...${NC}"
cp nginx-jaipurelitehomes.conf /etc/nginx/conf.d/jaipurelitehomes.conf

# Test Nginx config
nginx -t
systemctl reload nginx
echo -e "${GREEN}✓ Nginx configured and reloaded${NC}"

# Step 7: Setup SSL
echo -e "\n${YELLOW}Step 7: Setting up SSL certificate...${NC}"
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email info@$DOMAIN --redirect
echo -e "${GREEN}✓ SSL certificate installed${NC}"

# Step 8: Seed Database (optional - run manually if needed)
echo -e "\n${YELLOW}Step 8: Database seeding...${NC}"
echo -e "${YELLOW}Run this command manually if you need to seed the database:${NC}"
echo -e "cd $APP_DIR && python3 scripts/seed_db.py"

# Final status
echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e ""
echo -e "Website: https://$DOMAIN"
echo -e "Admin Panel: https://$DOMAIN/admin/login"
echo -e "Admin Username: admin"
echo -e "Admin Password: (see ADMIN_PASSWORD in backend/.env)"
echo -e ""
echo -e "PM2 Commands:"
echo -e "  pm2 list                    - View all apps"
echo -e "  pm2 logs jaipurelitehomes   - View logs"
echo -e "  pm2 restart all             - Restart all apps"
echo -e ""
pm2 list
