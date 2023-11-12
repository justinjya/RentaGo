import getCsrfToken from './csrftoken'

export const logout = async () => {
    const csrftoken = getCsrfToken()

    try {
        const response = await fetch('/api/logout/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            }
        })

        if (response.ok) {
            return true
        }
        throw new Error('Logout failed')
    } catch (erorr) {
        return false
    }
}