export const DEFAULT_PLATFORM_NAME = 'phu ai platform'
export const DEFAULT_SOFTWARE_VERSION = '5864.14000.28000.100000000⅛'
export const DEFAULT_SUPPORT_PROFILE = 'phu quoc nguyen human body brain'
export const DEFAULT_WIRELESS_SMARTDEVICES = 'phuhanddevice 81'

export interface UpgradePlanInput {
  aiEngines: string
  platformName: string
  softwareVersion: string
  supportProfile: string
  wirelessSmartdevices: string
}

export interface UpgradePlan {
  aiEngines: string[]
  platformName: string
  softwareVersion: string
  summary: string
  supportProfile: string
  wirelessSmartdevices: string[]
}

/**
 * Parses a newline or comma separated list into unique trimmed items.
 *
 * @param value Raw list input.
 * @returns Unique list entries in their original order.
 */
export function parseUniqueItems(value: string): string[] {
  const seen = new Set<string>()
  const items: string[] = []

  for (const item of value.split(/[,\n]/)) {
    const trimmedItem = item.trim()

    if (!trimmedItem) continue

    const normalizedItem = trimmedItem.toLowerCase()

    if (seen.has(normalizedItem)) continue

    seen.add(normalizedItem)
    items.push(trimmedItem)
  }

  return items
}

/**
 * Builds a normalized upgrade plan for the Phu AI platform.
 *
 * @param input Action inputs.
 * @returns Normalized upgrade plan values.
 */
export function buildUpgradePlan(input: UpgradePlanInput): UpgradePlan {
  const platformName = input.platformName.trim()
  const softwareVersion = input.softwareVersion.trim()
  const supportProfile = input.supportProfile.trim()
  const aiEngines = parseUniqueItems(input.aiEngines)
  const wirelessSmartdevices = parseUniqueItems(input.wirelessSmartdevices)

  if (!platformName) throw new Error('platform-name is required')
  if (!softwareVersion) throw new Error('software-version is required')
  if (!supportProfile) throw new Error('support-profile is required')
  if (aiEngines.length === 0) {
    throw new Error('ai-engines must include at least one engine')
  }
  if (wirelessSmartdevices.length === 0) {
    throw new Error(
      'wireless-smartdevices must include at least one target device'
    )
  }

  return {
    platformName,
    softwareVersion,
    supportProfile,
    aiEngines,
    wirelessSmartdevices,
    summary: `Prepared ${aiEngines.length} AI engine(s) and ${wirelessSmartdevices.length} wireless smartdevice target(s) for ${supportProfile} on ${platformName} version ${softwareVersion}.`
  }
}
