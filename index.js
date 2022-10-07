const core = require('@actions/core');
const github = require('@actions/github');

// most @actions toolkit packages have async methods
async function run() {
  try {

      const githubToken = core.getInput('githubToken');
      const owner = core.getInput('owner');
      const repository = core.getInput('repository');
      const branch = core.getInput('branch');
      await github.getOctokit(githubToken).request('POST /repos/' + owner + '/' + repository + '/merge-upstream', {
          'branch':branch
      })

  } catch (error) {
    core.error(error.message);
    core.setFailed(error.message);
  }
}


run();
