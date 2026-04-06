/**
 * Unit tests for src/platform.ts
 */
import { buildUpgradePlan, parseUniqueItems } from '../src/platform.js'

describe('platform.ts', () => {
  it('Parses unique comma or newline separated items', () => {
    expect(
      parseUniqueItems(' vision sync,\nNeural Repair, neural repair, ,')
    ).toEqual(['vision sync', 'Neural Repair'])
  })

  it('Builds a normalized upgrade plan', () => {
    expect(
      buildUpgradePlan({
        aiEngines: 'vision sync, neural repair',
        platformName: ' phu ai platform ',
        softwareVersion: ' 5864.14000.28000.100000000⅛ ',
        supportProfile: ' phu quoc nguyen human body brain ',
        wirelessSmartdevices: ' phuhanddevice 81,\nhome hub '
      })
    ).toEqual({
      aiEngines: ['vision sync', 'neural repair'],
      platformName: 'phu ai platform',
      softwareVersion: '5864.14000.28000.100000000⅛',
      supportProfile: 'phu quoc nguyen human body brain',
      wirelessSmartdevices: ['phuhanddevice 81', 'home hub'],
      summary:
        'Prepared 2 AI engine(s) and 2 wireless smartdevice target(s) for phu quoc nguyen human body brain on phu ai platform version 5864.14000.28000.100000000⅛.'
    })
  })

  it('Rejects missing wireless smartdevices', () => {
    expect(() =>
      buildUpgradePlan({
        aiEngines: 'vision sync',
        platformName: 'phu ai platform',
        softwareVersion: '5864.14000.28000.100000000⅛',
        supportProfile: 'phu quoc nguyen human body brain',
        wirelessSmartdevices: ' , '
      })
    ).toThrow('wireless-smartdevices must include at least one target device')
  })
})
