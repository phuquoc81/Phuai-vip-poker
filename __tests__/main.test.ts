/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { wait } from '../__fixtures__/wait.js'
import { upgradeDevice } from '../__fixtures__/upgrade.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/wait.js', () => ({ wait }))
jest.unstable_mockModule('../src/upgrade.js', () => ({ upgradeDevice }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((name: string) => {
      switch (name) {
        case 'milliseconds':
          return '500'
        case 'device-name':
          return ''
        case 'current-version':
          return ''
        case 'target-version':
          return ''
        default:
          return ''
      }
    })

    // Mock the wait function so that it does not actually wait.
    wait.mockImplementation(() => Promise.resolve('done!'))

    // Mock the upgradeDevice function.
    upgradeDevice.mockImplementation(() =>
      Promise.resolve({
        success: true,
        deviceName: 'phuhanddevice 81',
        previousVersion: '18164.998145.1.17.00',
        newVersion: '18164.998145.1.18.24',
        message:
          'Successfully upgraded phuhanddevice 81 from version 18164.998145.1.17.00 to version 18164.998145.1.18.24'
      })
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the time output', async () => {
    await run()

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'time',
      // Simple regex to match a time string in the format HH:MM:SS.
      expect.stringMatching(/^\d{2}:\d{2}:\d{2}/)
    )
  })

  it('Sets a failed status', async () => {
    // Clear the getInput mock and return an invalid value.
    core.getInput.mockClear().mockReturnValueOnce('this is not a number')

    // Clear the wait mock and return a rejected promise.
    wait
      .mockClear()
      .mockRejectedValueOnce(new Error('milliseconds is not a number'))

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      'milliseconds is not a number'
    )
  })

  it('Runs upgrade when device-name and target-version are provided', async () => {
    core.getInput.mockImplementation((name: string) => {
      switch (name) {
        case 'milliseconds':
          return '500'
        case 'device-name':
          return 'phuhanddevice 81'
        case 'current-version':
          return '18164.998145.1.17.00'
        case 'target-version':
          return '18164.998145.1.18.24'
        default:
          return ''
      }
    })

    await run()

    expect(upgradeDevice).toHaveBeenCalledWith({
      deviceName: 'phuhanddevice 81',
      currentVersion: '18164.998145.1.17.00',
      targetVersion: '18164.998145.1.18.24'
    })
    expect(core.setOutput).toHaveBeenCalledWith('upgrade-status', 'success')
    expect(core.setOutput).toHaveBeenCalledWith(
      'upgraded-version',
      '18164.998145.1.18.24'
    )
  })

  it('Skips upgrade when device-name is not provided', async () => {
    await run()

    expect(upgradeDevice).not.toHaveBeenCalled()
  })
})
