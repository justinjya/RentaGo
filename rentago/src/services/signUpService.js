export const signUp = async (supabase, email, username, password) => {
    if (!email || !username || !password) return false;
    
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        console.error('Error signing up:', error);
        return false;
    }

    const user = data.user
    
    if (user) {
        const { error } = await supabase
        .from('users')
        .insert([
            { username: username, email: email, user_id: user.id },
        ]);
            
        if (error) {
            console.error('Error inserting user:', error);
            return false;
        }
        
        return true;
    }

    return false;
}