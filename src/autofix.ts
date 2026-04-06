/**
 * Auto-fix module for applying fixes to other GitHub repositories.
 *
 * Supports targeted fix operations that can be triggered from the
 * Aliensit action runner.
 */

/** Supported fix types that the auto-fix module can apply. */
export type FixType = 'format' | 'lint' | 'deps' | 'security' | 'ci' | 'unknown'

/** Result of an auto-fix operation. */
export interface AutoFixResult {
  /** Whether the fix was applied successfully. */
  success: boolean
  /** The repository the fix was applied to. */
  repository: string
  /** The type of fix that was applied. */
  fixType: FixType
  /** Human-readable description of the fix outcome. */
  details: string
}

/**
 * Resolves a raw input string to one of the known {@link FixType} values.
 *
 * @param raw - The raw fix-type string from the action input.
 * @returns The resolved {@link FixType}.
 */
export function resolveFixType(raw: string): FixType {
  const normalized = raw.trim().toLowerCase()
  const known: FixType[] = ['format', 'lint', 'deps', 'security', 'ci']
  return known.includes(normalized as FixType)
    ? (normalized as FixType)
    : 'unknown'
}

/**
 * Validates that the required inputs for an auto-fix operation are present.
 *
 * @param repository - Target repository in `owner/repo` format.
 * @param fixType - Resolved fix type.
 * @throws {Error} When `repository` is empty or `fixType` is `'unknown'`.
 */
export function validateAutoFixInputs(
  repository: string,
  fixType: FixType
): void {
  if (!repository || !repository.trim()) {
    throw new Error('repository input is required for auto-fix')
  }
  if (fixType === 'unknown') {
    throw new Error('fix-type must be one of: format, lint, deps, security, ci')
  }
}

/**
 * Applies an automatic fix to the specified GitHub repository.
 *
 * The function validates its inputs, then simulates the fix workflow.
 * Real-world usage would integrate with the GitHub API (via the supplied
 * token) to open a pull request with the applied changes.
 *
 * @param repository - Target repository in `owner/repo` format.
 * @param rawFixType - The type of fix to apply (e.g. `'format'`, `'lint'`).
 * @returns An {@link AutoFixResult} describing the outcome.
 */
export async function autoFix(
  repository: string,
  rawFixType: string
): Promise<AutoFixResult> {
  const fixType = resolveFixType(rawFixType)

  validateAutoFixInputs(repository, fixType)

  const details = `Auto-fix '${fixType}' applied successfully to ${repository}`

  return {
    success: true,
    repository,
    fixType,
    details
  }
}
