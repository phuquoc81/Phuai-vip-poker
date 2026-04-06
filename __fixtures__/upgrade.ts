import { jest } from '@jest/globals'

export const upgradeDevice =
  jest.fn<typeof import('../src/upgrade.js').upgradeDevice>()
