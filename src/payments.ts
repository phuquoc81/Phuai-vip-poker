export interface Payment {
  amount: number
  description?: string
}

interface PaymentInput {
  amount?: number | string
  description?: string
}

function normalizePayment(
  payment: number | string | PaymentInput,
  index: number
): Payment {
  const amount =
    typeof payment === 'number' || typeof payment === 'string'
      ? Number(payment)
      : Number(payment.amount)

  if (!Number.isFinite(amount)) {
    throw new Error(`Payment at index ${index} is missing a valid amount`)
  }

  return {
    amount,
    description:
      typeof payment === 'object' && payment.description
        ? payment.description
        : undefined
  }
}

export function parsePayments(rawPayments: string): Payment[] {
  let parsedPayments: unknown

  try {
    parsedPayments = JSON.parse(rawPayments)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown JSON parse error'

    throw new Error(`payments must be valid JSON: ${message}`, {
      cause: error
    })
  }

  if (!Array.isArray(parsedPayments)) {
    throw new Error('payments must be a JSON array')
  }

  return parsedPayments.map((payment, index) =>
    normalizePayment(payment as number | string | PaymentInput, index)
  )
}

export function calculateTotalRevenue(payments: Payment[]): number {
  return payments.reduce((sum, payment) => sum + payment.amount, 0)
}

export function createRevenueReport(payments: Payment[]): string {
  const totalRevenue = calculateTotalRevenue(payments)
  const lines = ['Stripe Revenue', `Total Revenue: $${totalRevenue.toFixed(2)}`]

  if (payments.length === 0) {
    lines.push('Payments:', '- No payments found.')

    return lines.join('\n')
  }

  lines.push('Payments:')

  payments.forEach((payment, index) => {
    const suffix = payment.description ? ` — ${payment.description}` : ''
    lines.push(`- Payment ${index + 1}: $${payment.amount.toFixed(2)}${suffix}`)
  })

  return lines.join('\n')
}
