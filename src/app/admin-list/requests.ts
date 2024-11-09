const baseEndpoint = new URL('http://localhost:3000/api/admins')

export interface AdminInterface {
    user_id: string,
    created_at: string,
    email: string
    role: string,
    role_user_id: number
    address?: string
}
export async function getAdmins() {
    try {
        const response = await fetch(baseEndpoint, {
            method: 'GET'
        })
        const data = await response.json()
        console.log(data)
        return ({...data})
    } catch (error) {
        console.log(error)
    }

}

export async function addAdmin(email: string) {
    try {
        const response = await fetch(baseEndpoint, {
            method: 'POST',
            body: JSON.stringify({
                email
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        const data = response.json()
        console.log(data)
        return (data)
    } catch (error) {
        console.log(error)
    }

}

export async function removeAdmin(id: string) {
    try {
        const response = await fetch(baseEndpoint + `?id=${id}`, {
            method: 'DELETE'
        })
        const data = await response.json()
        console.log(data)
        return (data)
    } catch (error) {
        console.log(error)
    }

}