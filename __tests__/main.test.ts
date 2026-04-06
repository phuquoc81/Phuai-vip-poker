/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation(
      () => '[1.99, {"amount": 2.5, "description": "Pro plan"}]'
    )
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the Stripe revenue outputs', async () => {
    await run()

    expect(core.setOutput).toHaveBeenNthCalledWith(1, 'total-revenue', '4.49')
    expect(core.setOutput).toHaveBeenNthCalledWith(2, 'payment-count', '2')
    expect(core.setOutput).toHaveBeenNthCalledWith(
      3,
      'report',
      'Stripe Revenue\n' +
        'Total Revenue: $4.49\n' +
        'Payments:\n' +
        '- Payment 1: $1.99\n' +
        '- Payment 2: $2.50 — Pro plan'
    )
  })

  it('Sets a failed status', async () => {
    core.getInput.mockClear().mockReturnValueOnce('not json')

    await run()

    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('payments must be valid JSON')
    )
  })
})
