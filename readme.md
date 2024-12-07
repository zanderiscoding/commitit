# git-snark 🤖✍️

A CLI tool that generates snarky, humorous commit messages from your staged changes using AI. Because let's face it, writing commit messages is hard, and a little humor makes code reviews better.

> Fun fact: All commit messages in this repository were generated using git-snark itself. Yes, we eat our own dog food! 🐕

## Features

- 🤖 Uses OpenAI's GPT models to analyze your changes
- 😏 Generates witty, self-aware commit messages
- 🎯 Follows conventional commit format
- ✨ Interactive CLI with multiple options
- 🔧 Configurable AI model and prompt
- 🎨 Beautiful terminal output
- 🔑 Bring Your Own API Key - uses your OpenAI account

## Installation

### Via npm (recommended)

```bash
# Install globally from npm
npm install -g git-snark
```

### Build from source

```bash
# Clone the repository
git clone https://github.com/zanderiscoding/git-snark
cd git-snark

# Install dependencies
npm install

# Link the package globally
npm link
```

## Setup

1. Get an OpenAI API key from [OpenAI's platform](https://platform.openai.com/api-keys)
2. Set your API key:
```bash
git-snark set-key <key>
```

## Usage

1. Stage your changes:
```bash
git add .
```

2. Generate a commit message:
```bash
git-snark
```

3. Choose what to do with the generated message:
- Commit with it (instantly)
- Generate another one
- Edit it
- Cancel

## Commands

```bash
git-snark                   # Generate a commit message for staged changes
git-snark set-key           # Set your OpenAI API key
git-snark unset-key         # Remove your OpenAI API key
git-snark set-model <model> # Set the OpenAI model to use (gpt-4o by default)
git-snark show-model        # Show the current OpenAI model
git-snark edit-prompt       # Edit the AI prompt in the terminal
git-snark show-prompt       # Show the current AI prompt
git-snark reset-prompt      # Reset the AI prompt to default
git-snark help              # Show help message
```

## Configuration

### Models
Choose your preferred OpenAI model:
```bash
git-snark set-model gpt-4              # More creative, potentially funnier (default)
git-snark set-model gpt-4o-mini        # Fastest, cheapest
git-snark set-model <model>            # Any other model
```

### Custom Prompts
Customize the AI's personality:
```bash
git-snark edit-prompt     # Edit the prompt in the terminal
git-snark show-prompt     # View current prompt
git-snark reset-prompt    # Reset to default
```

## Snarky Examples

- "fix(auth): Removed console.logs because apparently customers can see those"
- "refactor(css): Replaced !important with actual specificity because I'm growing as a person"
- "feat(api): Added proper error handling instead of just hoping for the best"
- "chore(deps): Updated dependencies and sacrificed a goat to npm"

## Requirements

- Node.js 14.x or higher
- Git
- An OpenAI API key

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Add more snark

## License

MIT

## Contact me
I'm on X @zanderiscoding
