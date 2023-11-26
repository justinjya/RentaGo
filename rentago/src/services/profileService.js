export const getUserDetails = async (supabase, username) => {
    const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('username', username)

    if (error) {
        console.error(error)
        return false
    }

    return data
}