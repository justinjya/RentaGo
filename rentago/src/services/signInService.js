export const signIn = async (supabase, username, password) => {
    if (!username || !password) return false;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username);

    if (user) {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: user[0].email,
                password: password
            });

            if (error) {
                throw new Error(error);
            }
    
            return true;
        }
        catch (error) {
            console.error('Error signing in:', error);
            return false;
        }
        
    }

    if (error) {
        console.error('Error signing in:', error);
        return false;
    }

    return false;
}