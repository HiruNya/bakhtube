const API_ENDPOINT: string = "https://bakhtube-api.hiru.dev"

async function api<T, B>(path: string, json: B | null = null): Promise<T & { status: number } | null> {
    const response = await fetch(`${API_ENDPOINT}/${path}`, {
        method: (json!= null)? 'POST': 'GET',
        body: (json != null)? JSON.stringify(json): undefined,
        headers: (json != null)? {'Content-Type': 'application/json'}: undefined,
    })
    if (response.status === 404) {
        return null
    }
    return {...await response.json(), status: response.status}
}

async function api_array<T>(path: string): Promise<T[] | null> {
    const response = await fetch(`${API_ENDPOINT}/${path}`)
    if (response.status === 404) {
        return null
    }
    return await response.json()
}

export default api
export {api_array}
