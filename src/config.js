import Conf from 'conf';

const config = new Conf({
  projectName: 'git-snark'
});

export function getApiKey() {
  const key = config.get('openai-key');
  if (!key) {
    throw new Error('OpenAI API key not set. Run: git-snark set-key');
  }
  return key;
}

export function setApiKey(key) {
  config.set('openai-key', key);
} 