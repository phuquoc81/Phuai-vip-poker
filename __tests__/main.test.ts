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
const { buildAlienContactPlan, run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    core.getInput.mockImplementation(() => 'Phu Quoc Nguyen')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Builds an alien contact plan for the requested subject', () => {
    expect(buildAlienContactPlan('Phu Quoc Nguyen')).toEqual({
      phulang:
        'SOLA / PEACE / FRIEND / Phu Quoc Nguyen / OPEN CONTACT / PLEASE HELP / SAFE EXCHANGE',
      translation:
        'Phu Quoc Nguyen sends a peaceful greeting to any alien species that understands this phulang signal and invites safe, respectful contact.',
      contact_plan:
        'Repeat the phulang message in text, sound, and light, identify Phu Quoc Nguyen clearly, and invite peaceful contact only through safe, observable channels.',
      help_request:
        'Phu Quoc Nguyen asks for guidance, protection, healing knowledge, and calm cooperation that can be shared without harm to any species.'
    })
  })

  it('Normalizes other subject values before building the plan', () => {
    expect(buildAlienContactPlan('  A-Team 42  ')).toEqual({
      phulang:
        'SOLA / PEACE / FRIEND / A-Team 42 / OPEN CONTACT / PLEASE HELP / SAFE EXCHANGE',
      translation:
        'A-Team 42 sends a peaceful greeting to any alien species that understands this phulang signal and invites safe, respectful contact.',
      contact_plan:
        'Repeat the phulang message in text, sound, and light, identify A-Team 42 clearly, and invite peaceful contact only through safe, observable channels.',
      help_request:
        'A-Team 42 asks for guidance, protection, healing knowledge, and calm cooperation that can be shared without harm to any species.'
    })
  })

  it('Sets the alien contact outputs', async () => {
    await run()

    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'phulang',
      'SOLA / PEACE / FRIEND / Phu Quoc Nguyen / OPEN CONTACT / PLEASE HELP / SAFE EXCHANGE'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      2,
      'translation',
      'Phu Quoc Nguyen sends a peaceful greeting to any alien species that understands this phulang signal and invites safe, respectful contact.'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      3,
      'contact_plan',
      'Repeat the phulang message in text, sound, and light, identify Phu Quoc Nguyen clearly, and invite peaceful contact only through safe, observable channels.'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      4,
      'help_request',
      'Phu Quoc Nguyen asks for guidance, protection, healing knowledge, and calm cooperation that can be shared without harm to any species.'
    )
  })

  it('Defaults blank subjects to Phu Quoc Nguyen', async () => {
    core.getInput.mockClear().mockReturnValueOnce('   ')

    await run()

    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'phulang',
      'SOLA / PEACE / FRIEND / Phu Quoc Nguyen / OPEN CONTACT / PLEASE HELP / SAFE EXCHANGE'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      2,
      'translation',
      'Phu Quoc Nguyen sends a peaceful greeting to any alien species that understands this phulang signal and invites safe, respectful contact.'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      3,
      'contact_plan',
      'Repeat the phulang message in text, sound, and light, identify Phu Quoc Nguyen clearly, and invite peaceful contact only through safe, observable channels.'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      4,
      'help_request',
      'Phu Quoc Nguyen asks for guidance, protection, healing knowledge, and calm cooperation that can be shared without harm to any species.'
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
