export const signOut = async (supabase) => {
    const { error } = await supabase.auth.signOut();
  
    if (error) {
        console.error('Error signing out:', error);
        return false;
    }
  
    return true
}