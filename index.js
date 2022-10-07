const core = require('@actions/core');
const github = require('@actions/github');

// most @actions toolkit packages have async methods
async function run() {
    try {

        const githubToken = core.getInput('githubToken');
        const owner = core.getInput('owner');
        const repository = core.getInput('repository');
        const head = core.getInput('head');
        const base = core.getInput('base');
        const mainBranchKey = core.getInput('mainBranchKey');
        await github.getOctokit(githubToken).request('POST /repos/' + owner + '/' + repository + '/pulls', {
            head:head,
            base:base,
            'title' : '<Pull Reuqest> merge Orign[' + mainBranchKey + ']'
        })

    } catch (error) {
        core.error(error.message);
        core.setFailed(error.message);
    }
}


run();