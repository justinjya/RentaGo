export const getVehicles = async (
    supabase, type, pickupDate, dropoffDate, location, 
    minPrice, maxPrice, transmission, capacity, size, 
    rating, page = 1, pageSize = 5
    ) => {
    const pick_up_date = new Date(pickupDate).toISOString().split('T')[0];
    const drop_off_date = new Date(dropoffDate).toISOString().split('T')[0];

    const { data: vehicles, error } = await supabase
        .rpc('get_available_vehicles', {
            _type_: type,
            _location_: location,
            _pick_up_date_: pick_up_date,
            _drop_off_date_: drop_off_date,
            _min_price_: minPrice,
            _max_price_: maxPrice,
            _rating_: rating,
            _transmission_: transmission,
            _capacity_: capacity,
            _size_: size,
            _page_: page,
            _page_size_: pageSize
        })

    if (error) {
        console.error('Error getting vehicles:', error);
        return false;
    }

    return vehicles;
}

export const getLocations = async (supabase) => {
    const { data: locations, error } = await supabase
        .rpc('get_locations')

    if (error) {
        console.error('Error getting locations:', error);
        return false;
    }

    locations.unshift(null)

    return locations;
}