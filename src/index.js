#!/usr/bin/env node --no-deprecation

import enquirer from 'enquirer';
import chalk from 'chalk';
import { setApiKey, unsetApiKey, setModel, getModel, getPrompt, setPrompt, resetPrompt } from './config.js';
import { generateCommitMessage } from './ai.js';
import { getGitDiff, createCommit } from './git.js';
import { Command } from 'commander';
import { execSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const program = new Command();
const { prompt } = enquirer;

function readMultilineInput() {
  return new Promise((resolve) => {
    console.log(chalk.blue('Enter/paste your prompt. Press Ctrl+D (Unix) or Ctrl+Z (Windows) then Enter when done:'));
    console.log();
    
    let input = '';
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', (line) => {
      input += line + '\n';
    });

    rl.on('close', () => {
      resolve(input.trim());
    });
  });
}

// Move the main commit message generation logic to a separate function
async function generateAndHandleCommitMessage() {
  try {
    console.log(chalk.blue('📝 Analyzing your diff...'));
    
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
        console.log(chalk.green('✓ Commit created!'));
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
  .name('commitit')
  .description('Generate quality commit messages from your staged changes')
  .version('1.0.0');

program
  .command('help')
  .description('Show help for all commands')
  .action(() => {
    console.log(`
${chalk.bold('commitit')} - Generate quality commit messages using AI

${chalk.bold('USAGE')}
  $ commitit                           Generate a commit message for staged changes
  $ commitit set-key                   Set your OpenAI API key (interactive)
  $ commitit set-key <key>             Set your OpenAI API key directly
  $ commitit unset-key                 Remove your OpenAI API key
  $ commitit set-model <model>         Set the OpenAI model to use
  $ commitit show-model                Show the current OpenAI model
  $ commitit edit-prompt               Edit the AI prompt
  $ commitit show-prompt               Show the current AI prompt
  $ commitit reset-prompt              Reset the AI prompt to default
  $ commitit help                      Show this help message

${chalk.bold('EXAMPLES')}
  $ commitit                           Generate a message for staged changes
  $ commitit set-key                   Set your OpenAI API key interactively
  $ commitit set-key <key>             Set your OpenAI API key directly
  $ commitit set-model gpt-4o          Use GPT-4o model
  $ commitit set-model gpt-3.5-turbo   Use GPT-3.5 Turbo model
  $ commitit edit-prompt               Edit the AI prompt

${chalk.bold('WORKFLOW')}
  1. Set your OpenAI API key:           commitit set-key
  2. (Optional) Set model:              commitit set-model gpt-4o
  3. (Optional) Edit prompt:            commitit edit-prompt
  4. Stage some changes:                git add .
  5. Generate commit message:           commitit
`);
  });

program
  .command('set-key [key]')
  .description('Set your OpenAI API key (interactive or direct)')
  .action(async (key) => {
    if (key) {
      // Direct key input
      await setApiKey(key);
      console.log(chalk.green('✓ API key saved'));
    } else {
      // Interactive prompt
      const response = await prompt({
        type: 'password',
        name: 'apiKey',
        message: 'Enter your OpenAI API key:'
      });
      
      await setApiKey(response.apiKey);
      console.log(chalk.green('✓ API key saved'));
    }
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
  .command('edit-prompt')
  .description('Edit the AI prompt')
  .action(async () => {
    try {
      // Create a temporary file with current prompt
      const tmpFile = join(tmpdir(), `commitit-prompt-${Date.now()}.txt`);
      writeFileSync(tmpFile, getPrompt(), 'utf8');

      console.log(chalk.blue('\nCurrent prompt has been written to:'));
      console.log(chalk.bold(tmpFile));
      console.log(chalk.blue('\nEdit this file in your preferred editor, then return here.'));
      
      const { confirm } = await prompt({
        type: 'confirm',
        name: 'confirm',
        message: 'Have you finished editing the prompt?'
      });

      if (confirm) {
        // Read the edited content
        const newPrompt = readFileSync(tmpFile, 'utf8');
        
        if (newPrompt && newPrompt.trim()) {
          setPrompt(newPrompt.trim());
          console.log(chalk.green('✓ Prompt updated'));
        } else {
          console.log(chalk.yellow('Prompt was empty, keeping previous prompt'));
        }
      } else {
        console.log(chalk.yellow('Prompt update cancelled'));
      }

      // Clean up
      unlinkSync(tmpFile);
      
    } catch (error) {
      console.error(chalk.red('Error updating prompt:', error.message));
    }
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