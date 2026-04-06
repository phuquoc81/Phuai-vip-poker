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
    core.getInput.mockImplementation((name: string) => {
      switch (name) {
        case 'ai-engines':
          return 'vision sync, neural repair, neural repair'
        case 'platform-name':
          return ''
        case 'software-version':
          return ''
        case 'support-profile':
          return ''
        case 'wireless-smartdevices':
          return 'phuhanddevice 81, home hub'
        default:
          return ''
      }
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the upgrade plan outputs', async () => {
    await run()

    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'platform-name',
      'phu ai platform'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      2,
      'software-version',
      '5864.14000.28000.100000000⅛'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      3,
      'support-profile',
      'phu quoc nguyen human body brain'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      4,
      'ai-engines',
      'vision sync, neural repair'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      5,
      'wireless-smartdevices',
      'phuhanddevice 81, home hub'
    )
    expect(core.setOutput).toHaveBeenNthCalledWith(
      6,
      'summary',
      'Prepared 2 AI engine(s) and 2 wireless smartdevice target(s) for phu quoc nguyen human body brain on phu ai platform version 5864.14000.28000.100000000⅛.'
    )
    expect(core.info).toHaveBeenCalledWith(
      'Prepared 2 AI engine(s) and 2 wireless smartdevice target(s) for phu quoc nguyen human body brain on phu ai platform version 5864.14000.28000.100000000⅛.'
    )
  })

  it('Sets a failed status', async () => {
    core.getInput.mockImplementation((name: string) => {
      switch (name) {
        case 'ai-engines':
          return '   '
        case 'wireless-smartdevices':
          return 'phuhanddevice 81'
        default:
          return ''
      }
    })

    await run()

    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      'ai-engines must include at least one engine'
    )
  })
})
