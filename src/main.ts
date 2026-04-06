import * as core from '@actions/core'
import { wait } from './wait.js'
import { upgradeDevice } from './upgrade.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    const deviceName: string = core.getInput('device-name')
    const currentVersion: string = core.getInput('current-version')
    const targetVersion: string = core.getInput('target-version')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())

    if (deviceName && targetVersion) {
      const result = await upgradeDevice({
        deviceName,
        currentVersion,
        targetVersion
      })

      core.info(result.message)
      core.setOutput('upgrade-status', result.success ? 'success' : 'failed')
      core.setOutput('upgraded-version', result.newVersion)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
