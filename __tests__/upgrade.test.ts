/**
 * Unit tests for src/upgrade.ts
 */
import { upgradeDevice } from '../src/upgrade.js'

describe('upgrade.ts', () => {
  it('Throws when device name is missing', async () => {
    await expect(
      upgradeDevice({
        deviceName: '',
        currentVersion: '',
        targetVersion: '1.0'
      })
    ).rejects.toThrow('Device name is required')
  })

  it('Throws when target version is missing', async () => {
    await expect(
      upgradeDevice({
        deviceName: 'phuhanddevice 81',
        currentVersion: '',
        targetVersion: ''
      })
    ).rejects.toThrow('Target version is required')
  })

  it('Reports already up to date when versions match', async () => {
    const result = await upgradeDevice({
      deviceName: 'phuhanddevice 81',
      currentVersion: '18164.998145.1.18.24',
      targetVersion: '18164.998145.1.18.24'
    })

    expect(result.success).toBe(true)
    expect(result.newVersion).toBe('18164.998145.1.18.24')
    expect(result.message).toContain('already at version')
  })

  it('Upgrades from a lower version to the target version', async () => {
    const result = await upgradeDevice({
      deviceName: 'phuhanddevice 81',
      currentVersion: '18164.998145.1.17.00',
      targetVersion: '18164.998145.1.18.24'
    })

    expect(result.success).toBe(true)
    expect(result.previousVersion).toBe('18164.998145.1.17.00')
    expect(result.newVersion).toBe('18164.998145.1.18.24')
    expect(result.message).toContain('Successfully upgraded phuhanddevice 81')
    expect(result.message).toContain('18164.998145.1.18.24')
  })

  it('Upgrades from an empty current version to the target version', async () => {
    const result = await upgradeDevice({
      deviceName: 'phuhanddevice 81',
      currentVersion: '',
      targetVersion: '18164.998145.1.18.24'
    })

    expect(result.success).toBe(true)
    expect(result.newVersion).toBe('18164.998145.1.18.24')
  })
})
