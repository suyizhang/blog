#!/bin/bash

# Personal Website Deployment Script
echo "🚀 Starting Personal Website Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version check passed: $(node -v)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
if npm install; then
    print_status "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if npm install; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

cd ..

# Check if environment files exist
if [ ! -f ".env" ]; then
    print_warning "Frontend .env file not found. Copying from .env.example..."
    cp .env.example .env
    print_warning "Please update .env with your actual configuration"
fi

if [ ! -f "backend/.env" ]; then
    print_warning "Backend .env file not found. Copying from backend/.env.example..."
    cp backend/.env.example backend/.env
    print_warning "Please update backend/.env with your actual GitHub OAuth credentials"
fi

# Build frontend
echo "🔨 Building frontend..."
if npm run build; then
    print_status "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# Build backend
echo "🔨 Building backend..."
cd backend
if npm run build; then
    print_status "Backend build completed successfully"
else
    print_error "Backend build failed"
    exit 1
fi

cd ..

print_status "🎉 Deployment preparation completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env files with your actual configuration"
echo "2. Set up GitHub OAuth App and add credentials"
echo "3. Deploy frontend to Vercel/Netlify"
echo "4. Deploy backend to Railway/Render"
echo "5. Update CORS and callback URLs for production"
echo ""
echo "🚀 To start development servers:"
echo "   Frontend: npm run dev"
echo "   Backend:  cd backend && npm run dev"