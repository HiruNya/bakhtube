const API_ENDPOINT: string = "https://bakhtube-api.hiru.dev"

async function api<T, B>(path: string, json: B | null = null, token: string | null = null): Promise<T & { status: number } | null> {
    let headers = {}
    if (json != null) {
        headers = {
            ...headers,
            'Content-Type': 'application/json',
        }
    }
    if (token != null) {
        headers = {
            ...headers,
            'Authorization': `Bearer ${token}`,
        }
    }
    const response = await fetch(`${API_ENDPOINT}/${path}`, {
        method: (json!= null)? 'POST': 'GET',
        body: (json != null)? JSON.stringify(json): undefined,
        headers,
    })
    if (response.status === 404) {
        return null
    }
    return {...await response.json(), status: response.status}
}

async function api_array<T>(path: string, token: string | null = null): Promise<T[] | null> {
    const headers = (token != null)? {"Authorization": `Bearer ${token}`}: undefined
    const response = await fetch(`${API_ENDPOINT}/${path}`, {headers})
    if (response.status === 404) {
        return null
    }
    return await response.json()
}

export default api
export {api_array}
