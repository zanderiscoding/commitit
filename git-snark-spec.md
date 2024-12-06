# git-snark - Project Specification

## Overview
A dead-simple CLI tool that generates snarky commit messages from your staged changes using AI. Built with JavaScript.

## Core Features
1. Generate commit messages from staged changes
2. Uses OpenAI's GPT models
3. Single configuration option: API key

## Commands
```bash
git-snark           # Generate message from staged changes
git-snark --set-key # Set your OpenAI API key
```

## Technical Stack
- Dependencies:
  - `commander`: CLI framework
  - `simple-git`: Git operations
  - `conf`: API key storage
  - `chalk`: Pretty terminal output
  - `openai`: OpenAI API
  - `enquirer`: Interactive prompts

## Project Structure
```
src/
  ├── index.js      # CLI entry & main logic
  ├── git.js        # Git operations
  ├── ai.js         # OpenAI integration
  └── config.js     # API key management
```

## UX Flow After Getting AI Response
```
> git-snark

📝 Analyzing your questionable code decisions...

Generated message:
"fix(auth): Finally bothered to remove those console.logs you left in prod"

What would you like to do?
> Commit now with this message
  Generate another message
  Edit message
  Cancel

[If "Commit now with this message" selected]:
✓ Commit created! Maybe this time it'll work.

[If "Edit message" selected]:
Edit message: "fix(auth): Finally bothered to remove those _" (opens in $EDITOR)
```

## NPM Package
```json
{
  "name": "git-snark",
  "version": "1.0.0",
  "bin": {
    "git-snark": "./src/index.js"
  }
}
```

## Installation
```bash
npm install -g git-snark    # From npm
git-snark --set-key        # Set API key
git-snark                  # Use it
```

That's it. Just snarky commit messages, no complexity.
