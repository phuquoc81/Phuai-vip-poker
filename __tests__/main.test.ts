/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { autoFix } from '../__fixtures__/autofix.js'
import { wait } from '../__fixtures__/wait.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/autofix.js', () => ({ autoFix }))
jest.unstable_mockModule('../src/wait.js', () => ({ wait }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    // Return empty strings for auto-fix inputs so the default wait path runs.
    core.getInput.mockImplementation((name: string) => {
      if (name === 'milliseconds') return '500'
      return ''
    })

    // Mock the wait function so that it does not actually wait.
    wait.mockImplementation(() => Promise.resolve('done!'))
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
    // Override getInput to return an invalid milliseconds value while keeping
    // repository and fix-type empty so the wait path is exercised.
    core.getInput.mockImplementation((name: string) => {
      if (name === 'milliseconds') return 'this is not a number'
      return ''
    })

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

  describe('auto-fix mode', () => {
    beforeEach(() => {
      // Return repository and fix-type inputs to activate auto-fix mode.
      core.getInput.mockImplementation((name: string) => {
        if (name === 'repository') return 'phuquoc81/Aliensit'
        if (name === 'fix-type') return 'format'
        return ''
      })

      autoFix.mockImplementation(() =>
        Promise.resolve({
          success: true,
          repository: 'phuquoc81/Aliensit',
          fixType: 'format' as const,
          details:
            "Auto-fix 'format' applied successfully to phuquoc81/Aliensit"
        })
      )
    })

    it('Sets fix-status and fix-details outputs on success', async () => {
      await run()

      expect(autoFix).toHaveBeenCalledWith('phuquoc81/Aliensit', 'format')
      expect(core.setOutput).toHaveBeenCalledWith('fix-status', 'success')
      expect(core.setOutput).toHaveBeenCalledWith(
        'fix-details',
        "Auto-fix 'format' applied successfully to phuquoc81/Aliensit"
      )
    })

    it('Sets a failed status when autoFix throws', async () => {
      autoFix.mockRejectedValueOnce(new Error('GitHub API request failed'))
      core.getInput.mockImplementation((name: string) => {
        if (name === 'repository') return 'phuquoc81/Aliensit'
        if (name === 'fix-type') return 'format'
        return ''
      })

      await run()

      expect(core.setFailed).toHaveBeenCalledWith('GitHub API request failed')
    })
  })
})
