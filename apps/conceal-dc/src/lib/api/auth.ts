const API_URL = process.env.NEXT_PUBLIC_API_URL

export const requestOtp = async (email: string) => {
  const response = await fetch(`${API_URL}/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    throw new Error('Failed to request OTP')
  }

  return response.json()
}

export const verifyOtp = async (email: string, otpCode: string) => {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      otp_id: email,
      otp_code: otpCode,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to verify OTP')
  }

  const data = await response.json()
  localStorage.setItem('accessToken', data.access_token)
  localStorage.setItem('refreshToken', data.refresh_token)
  window.dispatchEvent(new Event('authStateChange'))

  return data
}
