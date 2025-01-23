export interface NotificationPreference {
  notificationId: string
  days: string[]
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

interface NotificationApiResponse {
  notification_id: string
  days: string[]
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  created_at: number
  updated_at: number
}

interface CreateNotificationRequest {
  days: string[]
  start_date: string
  end_date: string
  start_time: string
  end_time: string
}

interface TokenResponse {
  access_token: string
  refresh_token: string
}

async function refreshTokenIfNeeded(): Promise<boolean> {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  if (!accessToken || !refreshToken) {
    return false
  }

  // Check if token is expired by decoding the JWT
  try {
    const [, payload] = accessToken.split('.')
    const decodedPayload = JSON.parse(atob(payload!))
    const expirationTime = decodedPayload.exp * 1000 // Convert to milliseconds

    // If token is not expired or expires in more than 1 minute, return true
    if (expirationTime > Date.now() + 60000) {
      return true
    }

    // Token is expired or about to expire, try to refresh
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      // If refresh fails, clear tokens and return false
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      return false
    }

    const data: TokenResponse = await response.json()
    localStorage.setItem('accessToken', data.access_token)
    localStorage.setItem('refreshToken', data.refresh_token)
    return true
  } catch (error) {
    console.error('Error refreshing token:', error)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return false
  }
}

export const parseNotificationPreference = (
  preference: NotificationApiResponse,
): NotificationPreference => ({
  notificationId: preference.notification_id,
  days: preference.days,
  startDate: preference.start_date,
  endDate: preference.end_date,
  startTime: preference.start_time,
  endTime: preference.end_time,
  createdAt: new Date(preference.created_at * 1000).toISOString(),
  updatedAt: new Date(preference.updated_at * 1000).toISOString(),
})

export const fetchNotifications = async (): Promise<NotificationPreference[]> => {
  const isAuthenticated = await refreshTokenIfNeeded()
  if (!isAuthenticated) {
    return []
  }

  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    return []
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) throw new Error('Failed to fetch notifications')

  const data = await response.json()

  console.log('data', data)
  return data.items.map(parseNotificationPreference)
}

export const createNotification = async (
  preference: Omit<NotificationPreference, 'id' | 'createdAt'>,
): Promise<NotificationApiResponse> => {
  const isAuthenticated = await refreshTokenIfNeeded()
  if (!isAuthenticated) {
    throw new Error('No access token found')
  }

  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) throw new Error('No access token found')

  const apiPreference: CreateNotificationRequest = {
    days: preference.days,
    start_date: preference.startDate,
    end_date: preference.endDate,
    start_time: preference.startTime,
    end_time: preference.endTime,
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(apiPreference),
  })

  if (!response.ok) throw new Error('Failed to create notification')
  return response.json()
}

export const deleteNotification = async (id: string): Promise<void> => {
  const isAuthenticated = await refreshTokenIfNeeded()
  if (!isAuthenticated) {
    throw new Error('No access token found')
  }

  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) throw new Error('No access token found')

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) throw new Error('Failed to delete notification')
}

export const updateNotification = async (
  notification_id: string,
  preference: Omit<NotificationPreference, 'id' | 'createdAt'>,
): Promise<NotificationApiResponse> => {
  const isAuthenticated = await refreshTokenIfNeeded()
  if (!isAuthenticated) {
    throw new Error('No access token found')
  }

  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) throw new Error('No access token found')

  const apiPreference: CreateNotificationRequest = {
    days: preference.days,
    start_date: preference.startDate,
    end_date: preference.endDate,
    start_time: preference.startTime,
    end_time: preference.endTime,
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notification_id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(apiPreference),
    },
  )

  if (!response.ok) throw new Error('Failed to update notification')
  return response.json()
}
