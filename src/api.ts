const API_ENDPOINT: string = "https://bakhtube-api.hiru.dev"

async function api(path: string) {
    const response = await fetch(`${API_ENDPOINT}/${path}`)
    return await response.json()
}

export default api
