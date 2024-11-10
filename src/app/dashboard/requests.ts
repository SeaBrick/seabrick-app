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

        if (response.status >= 300) {
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