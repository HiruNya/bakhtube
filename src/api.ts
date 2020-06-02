const API_ENDPOINT: string = "https://bakhtube-api.hiru.dev"

async function api(path: string) {
    const response = await fetch(`${API_ENDPOINT}/${path}`)
    if (response.status === 404) {
        return null
    }
    return await response.json()
}

export default api
