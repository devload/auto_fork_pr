const core = require('@actions/core');
const github = require('@actions/github');
const wait = require('./wait');


// most @actions toolkit packages have async methods
async function run() {
  try {

      const githubToken = core.getInput('githubToken');
      const targetOwner = core.getInput('targetOwner');
      const targetRepository = core.getInput('targetRepository');
      const targetBranch = core.getInput('targetBranch');

      const prOwner = core.getInput('prOwner');
      const prRepository = core.getInput('prRepository');
      const prBranch = core.getInput('prBranch');
      const prBaseBranch = core.getInput('prBaseBranch');

    const {sha:mainBranchKey} = await getTopShaTag({
           owner : targetOwner,
           repo:targetRepository,
           branch:targetBranch
      }, githubToken);

    const {sha:forkBranchKey, octokit:forkBranchOctokit} = await getTopShaTag({
          owner : prOwner,
          repo:prRepository,
          branch:prBranch
    }, githubToken);



    core.setOutput('orgin', mainBranchKey);
    core.setOutput('fork', forkBranchKey);

    if(mainBranchKey != forkBranchKey){
      core.debug('Make Pull Request');

         await forkBranchOctokit.request('POST /repos/' + prOwner + '/' + prRepository + '/merge-upstream', {
            branch:prBranch
        })

        await forkBranchOctokit.request('POST /repos/' + prOwner + '/' + prRepository + '/pulls', {
            head:prBranch,
            base:prBaseBranch,
            'title' : '<Pull Reuqest> merge Orign[' + mainBranchKey + ']'
        })

    }

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
