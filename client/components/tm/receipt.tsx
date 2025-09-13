export function downloadReceipt(policyId: string, customerName: string) {
  // Create a simple receipt content
  const receiptContent = `
PolicyPal Receipt
================

Policy ID: ${policyId}
Customer: ${customerName}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Thank you for choosing PolicyPal!
  `.trim()

  // Create and download the receipt
  const blob = new Blob([receiptContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `receipt-${policyId}-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
