#!/bin/bash

# DanPortfolio GitHub Push Script
# Run this after creating your GitHub repository

echo "🚀 DanPortfolio GitHub Push Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Error: Please run this script from the DanPortfolio root directory"
    exit 1
fi

# Get GitHub username
echo "📝 Please enter your GitHub username:"
read -p "Username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username is required"
    exit 1
fi

echo ""
echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/$GITHUB_USERNAME/DanPortfolio.git

echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Success! Your repository is now on GitHub!"
echo "🌐 Repository URL: https://github.com/$GITHUB_USERNAME/DanPortfolio"
echo ""
echo "🚀 Next Steps:"
echo "1. Deploy Backend: Go to Railway and connect your GitHub repo"
echo "2. Deploy Frontend: Go to Vercel and connect your GitHub repo"
echo "3. Configure Domain: Set up daniyalareeb.com"
echo ""
echo "📚 See DEPLOYMENT_SUMMARY.md for detailed instructions"
