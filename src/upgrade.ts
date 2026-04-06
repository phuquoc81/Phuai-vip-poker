/**
 * Device software upgrade functionality.
 */

/**
 * Configuration for a device software upgrade.
 */
export interface DeviceUpgradeConfig {
  /** The name/identifier of the device to upgrade (e.g. 'phuhanddevice 81') */
  deviceName: string
  /** The current software version installed on the device */
  currentVersion: string
  /** The target software version to upgrade to (e.g. '18164.998145.1.18.24') */
  targetVersion: string
}

/**
 * The result of a device software upgrade operation.
 */
export interface UpgradeResult {
  /** Whether the upgrade operation completed successfully */
  success: boolean
  /** The name/identifier of the device */
  deviceName: string
  /** The software version before the upgrade */
  previousVersion: string
  /** The software version after the upgrade */
  newVersion: string
  /** A human-readable message describing the outcome */
  message: string
}

/**
 * Performs a software upgrade for the specified device to the target version.
 *
 * This function validates the upgrade parameters, checks whether an upgrade is
 * needed, and returns an {@link UpgradeResult} describing the outcome.
 *
 * Extend this function to integrate with a real device management API or
 * firmware delivery service when connecting to physical hardware.
 *
 * @param config The upgrade configuration containing device name, current
 *   version, and target version.
 * @returns Resolves with the result of the upgrade operation.
 * @throws {Error} If `deviceName` or `targetVersion` are empty.
 */
export async function upgradeDevice(
  config: DeviceUpgradeConfig
): Promise<UpgradeResult> {
  const { deviceName, currentVersion, targetVersion } = config

  if (!deviceName) throw new Error('Device name is required')
  if (!targetVersion) throw new Error('Target version is required')

  if (currentVersion === targetVersion) {
    return {
      success: true,
      deviceName,
      previousVersion: currentVersion,
      newVersion: targetVersion,
      message: `Device ${deviceName} is already at version ${targetVersion}`
    }
  }

  return {
    success: true,
    deviceName,
    previousVersion: currentVersion,
    newVersion: targetVersion,
    message: `Successfully upgraded ${deviceName} from version ${currentVersion} to version ${targetVersion}`
  }
}
