import * as core from '@actions/core'

export interface GroundedPlan {
  affirmation: string
  protection_plan: string
  wellbeing_plan: string
  money_plan: string
}

/**
 * Normalizes the subject used in plan text so outputs stay readable.
 *
 * The original request uses "phu" as the central subject, so blank or
 * whitespace-only values fall back to that default.
 *
 * @param subject Raw subject input from the action.
 * @returns A trimmed subject with internal whitespace collapsed.
 */
function normalizeSubject(subject: string): string {
  return subject.trim().replace(/\s+/g, ' ') || 'phu'
}

/**
 * Builds a grounded support plan for the requested subject.
 *
 * @param subject The person or project the plan should support.
 * @returns Practical security, wellbeing, and payment guidance.
 */
export function buildGroundedPlan(subject: string): GroundedPlan {
  const normalizedSubject = normalizeSubject(subject)

  return {
    affirmation: `${normalizedSubject} can move forward safely by combining practical security, healthy routines, and lawful payment tools.`,
    protection_plan: `Protect every door ${normalizedSubject} opens with strong locks, unique access codes, camera coverage, good lighting, backups, and trusted emergency contacts.`,
    wellbeing_plan: `Support ${normalizedSubject}'s body and mind with sleep, hydration, exercise, regular medical care, focused work blocks, and time for recovery and learning.`,
    money_plan: `For ${normalizedSubject} to make money, connect a real product or service to Stripe Checkout or Payment Links, enable bank transfer or e-transfer where available, and keep records for taxes, fraud checks, and payouts.`
  }
}

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const subject = normalizeSubject(core.getInput('subject'))
    const plan = buildGroundedPlan(subject)

    core.info(`Creating a grounded support plan for ${subject}.`)
    core.setOutput('affirmation', plan.affirmation)
    core.setOutput('protection_plan', plan.protection_plan)
    core.setOutput('wellbeing_plan', plan.wellbeing_plan)
    core.setOutput('money_plan', plan.money_plan)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
