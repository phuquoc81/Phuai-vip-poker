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
const { buildGroundedPlan, run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    core.getInput.mockImplementation(() => 'phu')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Builds a grounded plan for the requested subject', () => {
    expect(buildGroundedPlan('phu')).toEqual({
      affirmation:
        'phu can move forward safely by combining practical security, healthy routines, and lawful payment tools.',
      protection_plan:
        'Protect every door phu opens with strong locks, unique access codes, camera coverage, good lighting, backups, and trusted emergency contacts.',
      wellbeing_plan:
        "Support phu's body and mind with sleep, hydration, exercise, regular medical care, focused work blocks, and time for recovery and learning.",
      money_plan:
        'For phu to make money, connect a real product or service to Stripe Checkout or Payment Links, enable bank transfer or e-transfer where available, and keep records for taxes, fraud checks, and payouts.'
    })
  })

  it('Normalizes other subject values before building the plan', () => {
    expect(buildGroundedPlan('  A-Team 42  ')).toEqual({
      affirmation:
        'A-Team 42 can move forward safely by combining practical security, healthy routines, and lawful payment tools.',
      protection_plan:
        'Protect every door A-Team 42 opens with strong locks, unique access codes, camera coverage, good lighting, backups, and trusted emergency contacts.',
      wellbeing_plan:
        "Support A-Team 42's body and mind with sleep, hydration, exercise, regular medical care, focused work blocks, and time for recovery and learning.",
      money_plan:
        'For A-Team 42 to make money, connect a real product or service to Stripe Checkout or Payment Links, enable bank transfer or e-transfer where available, and keep records for taxes, fraud checks, and payouts.'
    })
  })

  it('Sets the grounded plan outputs', async () => {
    await run()

    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'affirmation',
      'phu can move forward safely by combining practical security, healthy routines, and lawful payment tools.'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      2,
      'protection_plan',
      'Protect every door phu opens with strong locks, unique access codes, camera coverage, good lighting, backups, and trusted emergency contacts.'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      3,
      'wellbeing_plan',
      "Support phu's body and mind with sleep, hydration, exercise, regular medical care, focused work blocks, and time for recovery and learning."
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      4,
      'money_plan',
      'For phu to make money, connect a real product or service to Stripe Checkout or Payment Links, enable bank transfer or e-transfer where available, and keep records for taxes, fraud checks, and payouts.'
    )
  })

  it('Defaults blank subjects to phu', async () => {
    core.getInput.mockClear().mockReturnValueOnce('   ')

    await run()

    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'affirmation',
      'phu can move forward safely by combining practical security, healthy routines, and lawful payment tools.'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      2,
      'protection_plan',
      'Protect every door phu opens with strong locks, unique access codes, camera coverage, good lighting, backups, and trusted emergency contacts.'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      3,
      'wellbeing_plan',
      "Support phu's body and mind with sleep, hydration, exercise, regular medical care, focused work blocks, and time for recovery and learning."
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      4,
      'money_plan',
      'For phu to make money, connect a real product or service to Stripe Checkout or Payment Links, enable bank transfer or e-transfer where available, and keep records for taxes, fraud checks, and payouts.'
    )
  })

  it('Sets a failed status when an output cannot be written', async () => {
    core.setOutput.mockImplementationOnce(() => {
      throw new Error('unable to write output')
    })

    await run()

    expect(core.setFailed).toHaveBeenNthCalledWith(1, 'unable to write output')
  })
})
