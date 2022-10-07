const core = require('@actions/core');
const github = require('@actions/github');


// most @actions toolkit packages have async methods
async function run() {
  try {

      const shaKey = core.getInput('shaKey');
      const githubToken = core.getInput('githubToken');
      const owner = core.getInput('owner');
      const repository = core.getInput('repository');
      const branch = core.getInput('branch');

      core.info({
          owner : owner,
          repo:repository,
          'branch':branch
      });

    const {sha:branchKey} = await getTopShaTag({
           owner : owner,
           repo:repository,
           'branch':branch
      }, githubToken);


    core.setOutput('result', branchKey);


  } catch (error) {
    core.error(error.message);
    core.setFailed(error.message);
  }
}

async function getTopShaTag(octoConfig, githubToken) {

  const octokit = github.getOctokit(githubToken);
  const branch = await octokit.rest.repos.getBranch(octoConfig);

  core.debug(branch);
  core.info(`${octoConfig.owner}${octoConfig.repo} ${octoConfig.branch} - head [${branch.data.commit.sha}]`);

  return {sha:branch.data.commit.sha,
          octokit : octokit};
}

run();
