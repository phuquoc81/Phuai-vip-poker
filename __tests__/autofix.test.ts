/**
 * Unit tests for src/autofix.ts
 */
import {
  autoFix,
  resolveFixType,
  validateAutoFixInputs
} from '../src/autofix.js'

describe('resolveFixType', () => {
  it.each(['format', 'lint', 'deps', 'security', 'ci'])(
    'returns known fix type "%s"',
    (type) => {
      expect(resolveFixType(type)).toBe(type)
    }
  )

  it('normalises to lowercase', () => {
    expect(resolveFixType('FORMAT')).toBe('format')
    expect(resolveFixType('Lint')).toBe('lint')
  })

  it('trims surrounding whitespace', () => {
    expect(resolveFixType('  deps  ')).toBe('deps')
  })

  it('returns "unknown" for unrecognised types', () => {
    expect(resolveFixType('rewrite')).toBe('unknown')
    expect(resolveFixType('')).toBe('unknown')
  })
})

describe('validateAutoFixInputs', () => {
  it('does not throw for valid inputs', () => {
    expect(() =>
      validateAutoFixInputs('phuquoc81/Aliensit', 'format')
    ).not.toThrow()
  })

  it('throws when repository is empty', () => {
    expect(() => validateAutoFixInputs('', 'format')).toThrow(
      'repository input is required for auto-fix'
    )
  })

  it('throws when repository is whitespace only', () => {
    expect(() => validateAutoFixInputs('   ', 'format')).toThrow(
      'repository input is required for auto-fix'
    )
  })

  it('throws when fixType is "unknown"', () => {
    expect(() =>
      validateAutoFixInputs('phuquoc81/Aliensit', 'unknown')
    ).toThrow('fix-type must be one of: format, lint, deps, security, ci')
  })
})

describe('autoFix', () => {
  it('returns a successful result for a valid repository and fix type', async () => {
    const result = await autoFix('phuquoc81/Aliensit', 'format')

    expect(result.success).toBe(true)
    expect(result.repository).toBe('phuquoc81/Aliensit')
    expect(result.fixType).toBe('format')
    expect(result.details).toContain('phuquoc81/Aliensit')
    expect(result.details).toContain('format')
  })

  it('rejects when repository is missing', async () => {
    await expect(autoFix('', 'lint')).rejects.toThrow(
      'repository input is required for auto-fix'
    )
  })

  it('rejects when fix-type is unrecognised', async () => {
    await expect(autoFix('phuquoc81/Aliensit', 'rewrite')).rejects.toThrow(
      'fix-type must be one of: format, lint, deps, security, ci'
    )
  })

  it.each(['format', 'lint', 'deps', 'security', 'ci'])(
    'succeeds for fix-type "%s"',
    async (type) => {
      const result = await autoFix('owner/repo', type)
      expect(result.success).toBe(true)
      expect(result.fixType).toBe(type)
    }
  )
})
