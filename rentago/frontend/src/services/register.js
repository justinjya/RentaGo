import getCsrfToken from './csrftoken'

export const register = async (username, email, password) => {
    const data = {
        username: username,
        email: email,
        password: password
    }

    const csrftoken = getCsrfToken()
  
    try {
        const response = await fetch('/api/register/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data)
        })
        
        if (response.ok) {
            return true
        }
        throw new Error('Register failed')
    } catch (error) {
        return false
    }
}