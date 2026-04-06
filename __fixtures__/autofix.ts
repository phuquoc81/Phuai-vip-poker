import { jest } from '@jest/globals'

export const autoFix = jest.fn<typeof import('../src/autofix.js').autoFix>()
