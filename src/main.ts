import * as core from '@actions/core'
import {
  calculateTotalRevenue,
  createRevenueReport,
  parsePayments
} from './payments.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const paymentsInput = core.getInput('payments')
    const payments = parsePayments(paymentsInput)
    const totalRevenue = calculateTotalRevenue(payments)
    const report = createRevenueReport(payments)

    core.info(report)
    core.setOutput('total-revenue', totalRevenue.toFixed(2))
    core.setOutput('payment-count', payments.length.toString())
    core.setOutput('report', report)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
