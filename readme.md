# commitit 🤖✍️

[![npm version](https://badge.fury.io/js/commitit.svg)](https://www.npmjs.com/package/commitit)

A CLI tool that generates high-quality, descriptive commit messages from your staged changes using AI. Born from its snarky sibling git-snark, commitit focuses on clear, professional communication that makes your git history more meaningful.

> Fun fact: This tool started as git-snark, a joke project for generating snarky commit messages. Turns out AI-generated commit messages were so helpful that this serious version was created! Sometimes the best tools come from unexpected places. 🚀

## Features

- 🤖 Uses OpenAI's GPT models to analyze your changes
- 📝 Generates clear, descriptive commit messages
- 🎯 Follows conventional commit format
- ✨ Interactive CLI with multiple options
- 🔧 Configurable AI model and prompt
- 🎨 Beautiful terminal output
- 🔑 Bring Your Own API Key - uses your OpenAI account

## Installation

### Via npm (recommended)

```bash
# Install globally from npm
npm install -g commitit
```

### Build from source

```bash
# Clone the repository
git clone https://github.com/zanderiscoding/commitit
cd commitit

# Install dependencies
npm install

# Link the package globally
npm link
```

## Setup

1. Get an OpenAI API key from [OpenAI's platform](https://platform.openai.com/api-keys)
2. Set your API key:
```bash
commitit set-key <key>
```

## Usage

1. Stage your changes:
```bash
git add .
```

2. Generate a commit message:
```bash
commitit
```

3. Choose what to do with the generated message:
- Commit with it (instantly)
- Generate another one
- Edit it
- Cancel

## Commands

```bash
commitit                   # Generate a commit message for staged changes
commitit set-key           # Set your OpenAI API key
commitit unset-key         # Remove your OpenAI API key
commitit set-model <model> # Set the OpenAI model to use (gpt-4o by default)
commitit show-model        # Show the current OpenAI model
commitit edit-prompt       # Edit the AI prompt in the terminal
commitit show-prompt       # Show the current AI prompt
commitit reset-prompt      # Reset the AI prompt to default
commitit help              # Show help message
```

## Configuration

### Models
Choose your preferred OpenAI model:
```bash
commitit set-model gpt-4o             # More detailed, context-aware (default)
commitit set-model gpt-4o-mini        # Faster, cheaper
commitit set-model <model>            # Any other model
```

### Custom Prompts
Customize the AI's output style:
```bash
commitit edit-prompt     # Edit the prompt in the terminal
commitit show-prompt     # View current prompt
commitit reset-prompt    # Reset to default
```

## Example Messages

- "feat(auth): Implement JWT-based authentication with refresh token support"
- "refactor(css): Improve stylesheet organization with BEM methodology"
- "fix(api): Handle edge cases in user validation middleware"
- "chore(deps): Update dependencies to address security vulnerabilities"

## Requirements

- Node.js 14.x or higher
- Git
- An OpenAI API key

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

MIT

## Contact me
I'm on X @zanderiscoding
