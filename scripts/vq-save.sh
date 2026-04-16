#!/bin/bash
# Vault-Quest: The "Save Crystal" Script
# Automates Git commits and pushes to GitHub.

cd /home/nbrow/vault-quest || exit

# Check if there are changes
if [[ -z $(git status -s) ]]; then
    echo "✨ No changes to save! Your quest is already fully recorded."
    exit 0
fi

# Add all changes
git add .

# Prompt for a commit message (optional) or use a default
MESSAGE="Save Point: $(date '+%Y-%m-%d %H:%M:%S')"
if [ -n "$1" ]; then
    MESSAGE="$1"
fi

git commit -m "$MESSAGE"

# Try to push if a remote exists
if git remote | grep -q 'origin'; then
    echo "🚀 Sending your progress to the Great Archive (GitHub)..."
    git push origin main
else
    echo "⚠️  No remote repository linked yet. Your progress is saved locally."
    echo "💡 To link to GitHub, run: git remote add origin <YOUR_GITHUB_URL>"
fi

echo "✅ Your quest has been recorded!"
