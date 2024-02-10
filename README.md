# wait-for-workflow-action
This action checks for a workflow run and waits for it to conclude if it is running.

## Inputs

### `token` ***Required**
Github token. Should have access to repo.

### `owner`
Owner of the repo where workflow resides. Default: owner of current repo.

### `repo`
Repo where the workflow resides. Default: current repo.

### `workflow` ***Required**
Name of the workflow file whose run we want to check and wait for.

### `branch`
Branch to check for workflow. Default: `"master"`.

### `interval`
Time between check (in ms). Default: `"60000"`.

### `timeout`
Timeout (in ms). Default: `"1800000"`.

## Example usage

```yaml
- name: Check for contract tests
  id: check-and-wait
  uses: Gunji-ng/wait-for-workflow-action@v1.0.0
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    owner: YourORG
    repo: desired-repo
    workflow: contract-tests.yml
    branch: master
    interval: 60000
    timeout: 1800000
```

## Tip
If you get a "Not Found" error for a workflow you know exists for certain, confirm your token's access to the repo. You could reach out to your devops/infrastructure team if you're implementing for an org.

## Use case
There could be situations where you don't want to run your job yet, if some other action in another repo is in progress and would prefer that run to conclude before you run your job.  

For example, contract tests in `repo A` could rely on some endpoints powered by `repo B`, and deploying changes to `repo B` would trigger a redeployment of the test environment which `repo A`'s running tests are using. This could lead to test failures which would disrupt deployments relying on those contract tests. In this case we would rather wait for the contract tests to be done before moving ahead with `repo B`'s deployment.  
Note that you can check and wait for other workflows in your current repo.