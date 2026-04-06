import * as core from '@actions/core'
import {
  buildUpgradePlan,
  DEFAULT_PLATFORM_NAME,
  DEFAULT_SOFTWARE_VERSION,
  DEFAULT_SUPPORT_PROFILE,
  DEFAULT_WIRELESS_SMARTDEVICES
} from './platform.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const plan = buildUpgradePlan({
      aiEngines: core.getInput('ai-engines'),
      platformName: core.getInput('platform-name') || DEFAULT_PLATFORM_NAME,
      softwareVersion:
        core.getInput('software-version') || DEFAULT_SOFTWARE_VERSION,
      supportProfile:
        core.getInput('support-profile') || DEFAULT_SUPPORT_PROFILE,
      wirelessSmartdevices:
        core.getInput('wireless-smartdevices') || DEFAULT_WIRELESS_SMARTDEVICES
    })

    core.info(plan.summary)
    core.debug(`AI engines: ${plan.aiEngines.join(', ')}`)
    core.debug(`Wireless smartdevices: ${plan.wirelessSmartdevices.join(', ')}`)

    core.setOutput('platform-name', plan.platformName)
    core.setOutput('software-version', plan.softwareVersion)
    core.setOutput('support-profile', plan.supportProfile)
    core.setOutput('ai-engines', plan.aiEngines.join(', '))
    core.setOutput(
      'wireless-smartdevices',
      plan.wirelessSmartdevices.join(', ')
    )
    core.setOutput('summary', plan.summary)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
