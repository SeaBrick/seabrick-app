import { toast } from "react-toastify"



export interface AdminInterface {
    user_id: string,
    created_at: string,
    email: string
    role: string,
    role_user_id: number
    address?: string
}
export async function mintTokens(address: string, amount: number) {
    try {
        const response = await fetch("/api/admins/mint", {
            method: 'POST',
            body: JSON.stringify({
                email: address,
                amount
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText}`)
        }
        const data = response.json()
        console.log(data)
        return (data)
    } catch (error) {
        toast.error((error as { message: string }).message)
        throw error
    }

}

export async function getClaimedTokens() {
    try {
        const response = await fetch("/api/seabrick_tokens", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText}`)
        }
        const data = response.json()
        console.log(data)
        return (data)
    } catch (error) {
        toast.error((error as { message: string }).message)
        // throw error
    }

}
export async function claimToken() {
    try {
        const response = await fetch("/api/seabrick_tokens", {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (!response.ok) {
            throw new Error(`${response.status} - ${response.statusText}`)
        }
        const data = response.json()
        console.log(data)
        return (data)
    } catch (error) {
        toast.error((error as { message: string }).message)
        throw error
    }

}