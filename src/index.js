import core from '@actions/core';
import * as github from '@actions/github';

function delay(waitInterval) {
  return new Promise((resolve) => setTimeout(resolve, waitInterval));
}

async function run() {
  try {
    const token = core.getInput('token', { required: true });
    const workflow_id = core.getInput('workflow', { required: true, trimWhitespace: true });
    const owner = core.getInput('owner', { trimWhitespace: true });
    const repo = core.getInput('repo', { trimWhitespace: true });
    const branch = core.getInput('branch', { trimWhitespace: true });
    const interval = parseInt(core.getInput('interval'));
    const timeout = parseInt(core.getInput('timeout'));
    const status = 'in_progress';
    let result;
    let attempt = 1;

    core.info(`Checking if ${owner}/${repo}/${workflow_id} has any jobs running`);
    core.info(`Check will exit when there's no job running or ${timeout}ms has been exceeded`);

    const octokit = github.getOctokit(token);
    const startTime = new Date().getTime();

    while (new Date().getTime() - startTime < timeout) {
      try {
        core.info(`Attempt: ${attempt}`);

        result = await octokit.rest.actions.listWorkflowRuns({
          owner,
          repo,
          workflow_id,
          branch,
          status
        });
        let { total_count } = result.data;

        core.info(`Jobs in progress: ${total_count}`);

        if (total_count === 0) {
          core.info('No pending workflow run');
          return;
        } else {
          await delay(interval);
        }
      } catch (error) {
        if (error.message.toLowerCase() === 'not found') {
          core.setFailed('Not found: Ensure the workflow exists and that your token has access to it');
          return;
        } else {
          core.setFailed(JSON.stringify(error, null, 2));
          await delay(interval);
        }
      }
      attempt += 1;
    }
    core.setFailed('Waiting exceeded timeout.');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();