#!/usr/bin/env node

import enquirer from 'enquirer';
import chalk from 'chalk';
import { setApiKey } from './config.js';
import { generateCommitMessage } from './ai.js';
import { getGitDiff, createCommit } from './git.js';
import { Command } from 'commander';
const program = new Command();
const { prompt } = enquirer;

program
  .name('git-snark')
  .description('Generate snarky commit messages from your staged changes')
  .version('1.0.0');

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

// Default command
program
  .action(async () => {
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
          console.log(chalk.green('✓ Commit created! Maybe this time it\'ll work.'));
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
          // Re-run the command
          process.exit(0);
        
        default:
          console.log(chalk.yellow('Operation cancelled'));
          process.exit(0);
      }
      
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      process.exit(1);
    }
  });

program.parse(); 