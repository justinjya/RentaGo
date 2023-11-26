export const getUserHistory = async (supabase, username) => {
    const { data, error } = await supabase
        .rpc('get_user_history', {
            _username_: username
        })
        
    if (error) {
        console.error(error)
        return false
    }

    return data
}

export const submitRating = async (supabase, rent_id, rating) => {
    const { error } = await supabase
        .from('rentals')
        .update({ rating: rating })
        .eq('rent_id', rent_id)
        .select()

    if (error) {    
        console.error(error)
        return false
    }

    return true
}