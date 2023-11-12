import getCsrfToken from './csrftoken'

export const checkLogin = async () => {
    const csrftoken = getCsrfToken()

    try {
        const response = await fetch('/api/login/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        })

        if (response.ok) {
            const data = await response.json()
            return data
        }

        throw new Error('Checking failed')
    } catch (error) {
        return { status: false, data: null}
    }
}
   
export const login = async (username, password) => {
    const data = {
        username: username,
        password: password
    }

    const csrftoken = getCsrfToken()

    try {
        const response = await fetch('/api/login/', {
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
        throw new Error('Login failed')
    } catch (error) {
        return false
    }
}