import Conf from 'conf';

const config = new Conf({
  projectName: 'commitit'
});

const DEFAULT_MODEL = 'gpt-4o';

const DEFAULT_PROMPT = `You are a senior developer who writes concise, clear commit messages that precisely capture changes in a single line.

When given a git diff, you generate a commit message that:
1. Follows conventional commit format: type(scope): concise message
2. Never exceeds one line
3. Captures key technical detail in minimal words
4. Uses present tense, imperative mood

Your style matches these examples:
- "fix(auth): Add rate limiting to login endpoint"
- "refactor(css): Consolidate button styles into theme"
- "feat(api): Implement user preference caching"
- "perf(db): Add index for frequently filtered columns"
- "chore(deps): Update React to v18.2.0"

You are:
- Extremely concise
- Technically precise
- Focused on key changes
- Limited to one line

Generate a single commit message without any explanation or additional commentary.`;

export function getApiKey() {
  const key = config.get('openai-key');
  if (!key) {
    throw new Error('OpenAI API key not set. Run: commitit set-key');
  }
  return key;
}

export function setApiKey(key) {
  config.set('openai-key', key);
}

export function unsetApiKey() {
  config.delete('openai-key');
}

export function getModel() {
  return config.get('model') || DEFAULT_MODEL;
}

export function setModel(model) {
  config.set('model', model);
}

export function getPrompt() {
  return config.get('prompt') || DEFAULT_PROMPT;
}

export function setPrompt(prompt) {
  config.set('prompt', prompt);
}

export function resetPrompt() {
  config.delete('prompt');
  return DEFAULT_PROMPT;
} 