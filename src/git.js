import simpleGit from 'simple-git';

const git = simpleGit();

export async function getGitDiff() {
  const status = await git.status();
  
  if (!status.staged.length) {
    return null;
  }

  const diff = await git.diff(['--cached']);
  return diff;
}

export async function createCommit(message) {
  await git.commit(message);
} 