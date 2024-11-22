import { toast } from "react-toastify"

const baseEndpoint = "/api/admins"

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
        if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText}`)
        }
        const data = await response.json()
        console.log(data)
        return ({ ...data })
    } catch (error) {
        toast.error((error as { message: string }).message)

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

        if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText}`)
        }
        const data = await response.json()
        console.log(data)
        return (data)
    } catch (error) {
        toast.error((error as { message: string }).message)
        throw error
    }

}

export async function removeAdmin(id: string) {
    try {
        const response = await fetch(baseEndpoint + `?id=${id}`, {
            method: 'DELETE'
        })
        if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText}`)
        }
        const data = await response.json()
        console.log(data)
        return (data)
    } catch (error) {
        console.log(error)
    }

}