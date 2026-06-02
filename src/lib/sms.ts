/** Normalize SA mobile numbers to E.164 (+27...) */
export function normalizeSaPhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10 && digits.startsWith('0')) {
    return `+27${digits.slice(1)}`
  }
  if (digits.length === 11 && digits.startsWith('27')) {
    return `+${digits}`
  }
  if (digits.length === 9 && !digits.startsWith('0')) {
    return `+27${digits}`
  }
  return null
}

export function isSmsConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
  )
}

export async function sendSellerInquirySms({
  sellerPhone,
  buyerName,
  propertyTitle,
}: {
  sellerPhone: string
  buyerName: string
  propertyTitle: string
}) {
  const to = normalizeSaPhone(sellerPhone)
  if (!to) {
    return { ok: false, error: 'Invalid seller phone number' }
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !from) {
    return { ok: false, skipped: true as const }
  }

  const body = `Homescount: New enquiry from ${buyerName} about "${propertyTitle.slice(0, 40)}${propertyTitle.length > 40 ? '…' : ''}". View in your seller portal.`

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: from,
          Body: body,
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('Twilio SMS error:', err)
      return { ok: false, error: 'SMS delivery failed' }
    }

    return { ok: true }
  } catch (error) {
    console.error('SMS send error:', error)
    return { ok: false, error: 'SMS delivery failed' }
  }
}
