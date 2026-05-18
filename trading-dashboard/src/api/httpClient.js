async function request(url, options = {}) {
  if(!url || url === '') {
    throw new Error('URL is required')
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`)
  }

  return response.json()
}

export const httpClient = {
  get(url, options = {}) {
    return request(url, {
      ...options,
      method: 'GET',
    })
  },
}