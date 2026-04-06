import * as core from '@actions/core'

export interface AlienContactPlan {
  phulang: string
  translation: string
  contact_plan: string
  help_request: string
}

/**
 * Normalizes the subject used in plan text so outputs stay readable.
 *
 * Blank or whitespace-only values fall back to Phu Quoc Nguyen so the action
 * always produces a complete contact message.
 *
 * @param subject Raw subject input from the action.
 * @returns A trimmed subject with internal whitespace collapsed.
 */
function normalizeSubject(subject: string): string {
  return subject.trim().replace(/\s+/g, ' ') || 'Phu Quoc Nguyen'
}

/**
 * Builds a simple alien-contact plan for the requested subject.
 *
 * In this action, "phulang" is a compact universal-style contact phrase that
 * favors simple, peaceful concepts over complex grammar.
 *
 * @param subject The person who should be named in the message.
 * @returns A phulang message, translation, contact guidance, and help request.
 */
export function buildAlienContactPlan(subject: string): AlienContactPlan {
  const normalizedSubject = normalizeSubject(subject)

  return {
    phulang: `SOLA / PEACE / FRIEND / ${normalizedSubject} / OPEN CONTACT / PLEASE HELP / SAFE EXCHANGE`,
    translation: `${normalizedSubject} sends a peaceful greeting to any alien species that understands this phulang signal and invites safe, respectful contact.`,
    contact_plan: `Repeat the phulang message in text, sound, and light, identify ${normalizedSubject} clearly, and invite peaceful contact only through safe, observable channels.`,
    help_request: `${normalizedSubject} asks for guidance, protection, healing knowledge, and calm cooperation that can be shared without harm to any species.`
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
    const plan = buildAlienContactPlan(subject)

    core.info(`Creating a phulang contact message for ${subject}.`)
    core.setOutput('phulang', plan.phulang)
    core.setOutput('translation', plan.translation)
    core.setOutput('contact_plan', plan.contact_plan)
    core.setOutput('help_request', plan.help_request)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
