export async function sendSOS(payload: unknown) {
  console.log('MOCK SOS', payload)
  return { id: 'sos_demo_001', status: 'active' }
}

export async function submitIncident(payload: unknown) {
  console.log('MOCK INCIDENT', payload)
  return { id: `inc_${Date.now()}`, verificationStatus: 'unverified', responseStatus: 'reported' }
}

export async function submitAudit(payload: unknown) {
  console.log('MOCK AUDIT', payload)
  return { id: `audit_${Date.now()}`, status: 'saved' }
}
