import * as core from '@actions/core'
import { autoFix } from './autofix.js'
import { wait } from './wait.js'

/**
 * The main function for the action.
 *
 * When the `repository` and `fix-type` inputs are provided the action runs
 * an auto-fix operation against the target repository and reports the
 * outcome via the `fix-status` and `fix-details` outputs.
 *
 * When those inputs are absent the action falls back to the original
 * behaviour of waiting for the specified number of milliseconds and
 * reporting the current time via the `time` output.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const repository: string = core.getInput('repository')
    const fixType: string = core.getInput('fix-type')

    if (repository && fixType) {
      core.debug(`Running auto-fix '${fixType}' on repository '${repository}'`)

      const result = await autoFix(repository, fixType)

      core.setOutput('fix-status', result.success ? 'success' : 'failed')
      core.setOutput('fix-details', result.details)

      core.info(result.details)
      return
    }

    const ms: string = core.getInput('milliseconds')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
