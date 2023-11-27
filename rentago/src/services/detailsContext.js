import React, { createContext, useState, useEffect, useContext } from 'react';

const DetailsContext = createContext();

export const DetailsProvider = ({ children }) => {
    const storedDetails = JSON.parse(localStorage.getItem('details') || '{}');

    const [type, setType] = useState(storedDetails.type || "Car"); 
    const [pickupDate, setPickupDate] = useState(storedDetails.pickupDate || null);
    const [dropoffDate, setDropoffDate] = useState(storedDetails.dropoffDate || null);
    const [location, setLocation] = useState(storedDetails.location || null);
    const [minPrice, setMinPrice] = useState(storedDetails.minPrice || 200_000);
    const [maxPrice, setMaxPrice] = useState(storedDetails.maxPrice || 1_500_000);
    const [transmission, setTransmission] = useState(storedDetails.transmission || null);
    const [capacity, setCapacity] = useState(storedDetails.capacity || null);
    const [size, setSize] = useState(storedDetails.size || null);
    const [rating, setRating] = useState(storedDetails.rating || 0);
    const [vehicle, setVehicle] = useState(storedDetails.vehicle || null);
    const [rental, setRental] = useState(storedDetails.rental || null);

    const resetDetails = () => {
        setType("Car");
        setPickupDate(null);
        setDropoffDate(null);
        setLocation("");
        setMinPrice(0);
        setMaxPrice(1_500_000);
        setTransmission(null);
        setCapacity(null);
        setSize(null);
        setRating(0);
        setVehicle(null);
        setRental(null);
      };

    useEffect(() => {
        const details = {
            type,
            pickupDate,
            dropoffDate,
            location,
            minPrice,
            maxPrice,
            transmission,
            capacity,
            size,
            rating,
            vehicle,
            rental
        };
          
        localStorage.setItem('details', JSON.stringify(details));
    }, [type, pickupDate, dropoffDate, location, minPrice, maxPrice, transmission, capacity, size, rating, vehicle, rental]);

    return (
        <DetailsContext.Provider 
            value={{
                type, setType,
                pickupDate, setPickupDate,
                dropoffDate, setDropoffDate,
                location, setLocation,
                minPrice, setMinPrice,
                maxPrice, setMaxPrice,
                transmission, setTransmission,
                capacity, setCapacity,
                size, setSize,
                rating, setRating,
                vehicle, setVehicle,
                rental, setRental,
                resetDetails
            }}
        >
            {children}
        </DetailsContext.Provider>
    )
}

export const useDetails = () => {
    return useContext(DetailsContext);
}