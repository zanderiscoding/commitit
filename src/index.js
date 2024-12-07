#!/usr/bin/env node

import enquirer from 'enquirer';
import chalk from 'chalk';
import { setApiKey, unsetApiKey, setModel, getModel, getPrompt, setPrompt, resetPrompt } from './config.js';
import { generateCommitMessage } from './ai.js';
import { getGitDiff, createCommit } from './git.js';
import { Command } from 'commander';
const program = new Command();
const { prompt } = enquirer;

// Move the main commit message generation logic to a separate function
async function generateAndHandleCommitMessage() {
  try {
    console.log(chalk.blue('📝 Analyzing your questionable code decisions...'));
    
    const diff = await getGitDiff();
    if (!diff) {
      console.log(chalk.yellow('No staged changes found. Stage some changes first!'));
      process.exit(1);
    }

    const message = await generateCommitMessage(diff);
    
    const { action } = await prompt({
      type: 'select',
      name: 'action',
      message: `Generated message:\n"${message}"\n\nWhat would you like to do?`,
      choices: [
        'Commit now with this message',
        'Generate another message',
        'Edit message',
        'Cancel'
      ]
    });

    switch (action) {
      case 'Commit now with this message':
        await createCommit(message);
        console.log(chalk.green('✓ Commit created... snarkily!'));
        break;
      
      case 'Edit message':
        const { editedMessage } = await prompt({
          type: 'input',
          name: 'editedMessage',
          message: 'Edit message:',
          initial: message
        });
        await createCommit(editedMessage);
        console.log(chalk.green('✓ Commit created with edited message!'));
        break;
      
      case 'Generate another message':
        return generateAndHandleCommitMessage();
      
      default:
        console.log(chalk.yellow('Operation cancelled'));
        process.exit(0);
    }
    
  } catch (error) {
    console.error(chalk.red('Error:', error.message));
    process.exit(1);
  }
}

program
  .name('git-snark')
  .description('Generate snarky commit messages from your staged changes')
  .version('1.0.0');

program
  .command('help')
  .description('Show help for all commands')
  .action(() => {
    console.log(`
${chalk.bold('git-snark')} - Generate snarky commit messages using AI

${chalk.bold('USAGE')}
  $ git-snark                  Generate a commit message for staged changes
  $ git-snark set-key         Set your OpenAI API key
  $ git-snark unset-key       Remove your OpenAI API key
  $ git-snark set-model MODEL Set the OpenAI model to use
  $ git-snark show-model      Show the current OpenAI model
  $ git-snark set-prompt      Edit the AI prompt in your default editor
  $ git-snark show-prompt     Show the current AI prompt
  $ git-snark reset-prompt    Reset the AI prompt to default
  $ git-snark help            Show this help message

${chalk.bold('EXAMPLES')}
  $ git-snark                              # Generate a message for staged changes
  $ git-snark set-key                      # Set your OpenAI API key
  $ git-snark set-model gpt-4o             # Use GPT-4o model
  $ git-snark set-model gpt-3.5-turbo      # Use GPT-3.5 Turbo model
  $ git-snark set-prompt                   # Edit the AI prompt

${chalk.bold('WORKFLOW')}
  1. Set your OpenAI API key:     git-snark set-key
  2. (Optional) Set model:        git-snark set-model gpt-4o
  3. (Optional) Edit prompt:      git-snark set-prompt
  4. Stage some changes:          git add .
  5. Generate commit message:     git-snark
`);
  });

program
  .command('set-key')
  .description('Set your OpenAI API key')
  .action(async () => {
    const response = await prompt({
      type: 'password',
      name: 'apiKey',
      message: 'Enter your OpenAI API key:'
    });
    
    await setApiKey(response.apiKey);
    console.log(chalk.green('✓ API key saved'));
  });

program
  .command('unset-key')
  .description('Remove your OpenAI API key')
  .action(() => {
    unsetApiKey();
    console.log(chalk.green('✓ API key removed'));
  });

program
  .command('set-model <model>')
  .description('Set the OpenAI model to use (e.g., gpt-4o, gpt-3.5-turbo)')
  .action((model) => {
    setModel(model);
    console.log(chalk.green(`✓ Model set to ${model}`));
  });

program
  .command('show-model')
  .description('Show the current OpenAI model')
  .action(() => {
    const model = getModel();
    console.log(chalk.blue(`Current model: ${model}`));
  });

program
  .command('set-prompt')
  .description('Set the AI prompt')
  .action(async () => {
    const { newPrompt } = await prompt({
      type: 'input',
      name: 'newPrompt',
      message: 'Enter new prompt:',
      initial: getPrompt()
    });
    
    setPrompt(newPrompt.trim());
    console.log(chalk.green('✓ Prompt updated'));
  });

program
  .command('show-prompt')
  .description('Show the current AI prompt')
  .action(() => {
    console.log(chalk.blue('\nCurrent prompt:\n'));
    console.log(getPrompt());
    console.log();
  });

program
  .command('reset-prompt')
  .description('Reset the AI prompt to default')
  .action(() => {
    const defaultPrompt = resetPrompt();
    console.log(chalk.green('✓ Prompt reset to default'));
  });

// Default command
program
  .action(() => generateAndHandleCommitMessage());

program.parse();