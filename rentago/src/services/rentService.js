export const rent = async (
    supabase, pickupDate, dropoffDate, firstName, 
    lastName, phoneNumber, username, vehicle_id
    ) => {
    const localePhoneNumber = '0' + phoneNumber
    
    const { data, error } = await supabase
        .from('rentals')
        .insert([{ 
            pick_up_date: pickupDate, 
            drop_off_date: dropoffDate, 
            first_name: firstName, 
            last_name: lastName, 
            phone_number: localePhoneNumber, 
            username: username, 
            vehicle_id: vehicle_id 
        }])
        .select()

    if (error) {
        console.error(error)
        return false
    }

    return data
}