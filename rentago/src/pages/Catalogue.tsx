'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns'
import {
  Button,
  Text,
  Container,
  Flex,
  Box,
  VStack,
  HStack,
  Image,
  Spacer,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
} from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useSupabase } from '../services/supabaseService'
import { useDetails } from '../services/detailsContext'
import { getVehicles } from '../services/catalogueService'
import { GoPersonFill } from 'react-icons/go'
import { GiGearStickPattern } from 'react-icons/gi'
import { BsCarFrontFill } from 'react-icons/bs'
import { FaMotorcycle } from "react-icons/fa6";
import { MdOutlineStar } from "react-icons/md";
import { StarRating } from '../components/StarRating'
import { renderMenuItem } from './Landing'

export default function Catalog() {
  const supabase = useSupabase();
  const navigate = useNavigate();

  const {
    MIN_PRICE, MAX_PRICE,
    type,
    pickupDate, dropoffDate, 
    location,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    transmission, setTransmission,
    capacity, setCapacity,
    size, setSize,
    rating, setRating,
    setVehicle,
    rental,
  } = useDetails();

  useEffect(() => {
    if (rental) {
      navigate("/pay");
    }
    if (!pickupDate || !dropoffDate || location === "") {
      navigate('/')
    }
    return;
  })
  
  const [catalogue, setCatalogue] = useState<any[]>([])
  const [catalogueLength, setCatalogueLength] = useState(0)
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchCatalogue = async () => {
      const data = await getVehicles(supabase, type, pickupDate, dropoffDate, location, minPrice, maxPrice, transmission, capacity, size, rating, page, pageSize)
      if (data && data[0]) {
        setCatalogue(data)
        setCatalogueLength(data[0].total_count)
      } 
      else {
        setCatalogue([])
        setCatalogueLength(0)
      }
    }

    fetchCatalogue()
  }, [supabase, type, pickupDate, dropoffDate, location, minPrice, maxPrice, transmission, capacity, size, rating, page, pageSize])

  const handleRentNow = (vehicle: any) => {
    setVehicle(vehicle);
    navigate("/rent");
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const predefinedFilterValues = {
    'transmission': [null, 'Automatic', 'Manual'],
    'capacity': [null, 5, 7, 9],
    'size': [null, 'Small', 'Medium', 'Large'],
  }

  return (
    pickupDate && dropoffDate && location &&
    <Flex
      w="100%"
      align={'start'}
      justify={'center'}
      direction={'column'}>
        <HStack mt="25px" ml="60px" align="start">
          <Box w="300px" h="115vh" >
            <Text fontSize={33} color="#F9F9FB">{type} Rentals</Text>
            <Text fontSize={17} color="#F9F9FB">for {format(new Date(pickupDate), 'dd/MM/yyyy')} - {format(new Date(dropoffDate), 'dd/MM/yyyy')}</Text>
            <Text fontSize={17} color="#F9F9FB">in {location}</Text>
            <Box mt="20px" bg="#F9F9FB" w="100%" h="530px" borderRadius="20px">
              <VStack alignItems={'flex-start'} p={'25px'}>
                <Text w="100%" textAlign="center" fontSize="16px">Filters</Text>~
                <Text fontSize="14px">Price</Text>
                <Flex w="100%" justifyContent={"center"}>
                  <RangeSlider aria-label={['min', 'max']} defaultValue={[minPrice, maxPrice]} min={MIN_PRICE} max={MAX_PRICE} step={50_000} w="230px" onChangeEnd={(val) => {setMinPrice(val[0]); setMaxPrice(val[1])} }>
                    <RangeSliderTrack bg="#D9DDE9" h="14px" borderRadius={20}>
                    <RangeSliderFilledTrack bg="transparent">
                    <Box
                      bgGradient="linear(to-r, #504497, #E84C83, #504497)"
                      h="100%"
                      w="100%"/>
                    </RangeSliderFilledTrack>
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} bg="#E84C83" boxSize="20px" borderRadius="6px"/>
                    <RangeSliderThumb index={1} bg="#E84C83" boxSize="20px" borderRadius="6px"/>
                  </RangeSlider>
                </Flex>
                <HStack>
                  <VStack alignItems={"start"} spacing={2}>
                    <Text fontSize="14px">Min</Text>
                    <Box bg="#D9DDE9" w="120px" h="40px" borderRadius="15" display="flex" alignItems="center" justifyContent="center">
                      Rp{minPrice.toLocaleString('id-ID')}
                    </Box>
                  </VStack>
                  <VStack alignItems={"start"} spacing={2}>
                    <Text fontSize="14px">Max</Text>
                    <Box bg="#D9DDE9" w="120px" h="40px" borderRadius="15" display="flex" alignItems="center" justifyContent="center">
                      Rp{maxPrice.toLocaleString('id-ID')}
                    </Box>
                  </VStack>
                </HStack>
                <Text fontSize="14px">Rating</Text>
                <StarRating size="28" spacing="3" value={rating} onRatingChange={handleRatingChange} />
                <Text>Transmission</Text>
                <Menu placement="bottom-start" offset={[0, -20]}>
                  {({ isOpen }) => (
                    <>
                      <MenuButton as={Button} w="250px" bg="#D9DDE9" fontWeight="normal" textAlign="start" borderRadius="20px" rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} zIndex={8} _expanded={{ bg: "#D9DDE9"}}>
                        {transmission}
                      </MenuButton>
                      <MenuList position="fixed" bg="#D9DDE9" w="250px" borderRadius="0 0 20px 20px" zIndex={7}>
                        <Box>
                          <Spacer h="3px" />
                        </Box>
                        <MenuDivider/>
                        {predefinedFilterValues['transmission'].map((value, index, array) => renderMenuItem(value, index, array, setTransmission))}
                      </MenuList>
                    </>
                  )}
                </Menu>
                <Text>Capacity</Text>
                <Menu placement="bottom-start" offset={[0, -20]}>
                  {type === "Car" ? (
                    <Menu placement="bottom-start" offset={[0, -20]}>
                      {({ isOpen }) => (
                        <>
                          <MenuButton as={Button} w="250px" h="45px" bg="#D9DDE9" fontWeight="normal" textAlign="start" borderRadius="20px" rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} zIndex={6} _expanded={{ bg: "#D9DDE9"}}>
                            {capacity}
                          </MenuButton>
                          <MenuList position="fixed" bg="#D9DDE9" w="250px"  borderRadius="0 0 20px 20px" zIndex={5}>
                            <Box>
                              <Spacer h="3px" />
                            </Box>
                            <MenuDivider/>
                            {predefinedFilterValues['capacity'].map((value, index, array) => renderMenuItem(value, index, array, setCapacity))}
                          </MenuList>
                        </>
                      )}
                    </Menu>
                    ) : (
                      <Button w="250px" h="45px" bg="#D9DDE9" fontWeight="normal" textAlign="start" justifyContent="start" borderRadius="20px" _hover={{}} isDisabled>
                        2
                      </Button>
                    )}
                </Menu>
                <Text>Size</Text>
                <Menu placement="bottom-start" offset={[0, -20]} >
                  {({ isOpen }) => (
                    <>
                      <MenuButton as={Button} w="250px" h="45px" bg="#D9DDE9" fontWeight="normal" textAlign="start" borderRadius="20px" rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} zIndex={4} _expanded={{ bg: "#D9DDE9"}}>
                        {size}
                      </MenuButton>
                      <MenuList position="fixed" bg="#D9DDE9" w="250px" borderRadius="0 0 20px 20px" zIndex={3}>
                        <Box>
                          <Spacer h="3px" />
                        </Box>
                        <MenuDivider/>
                        {predefinedFilterValues['size'].map((value, index, array) => renderMenuItem(value, index, array, setSize))}
                      </MenuList>
                    </>
                  )}
                </Menu>
              </VStack>
            </Box>
          </Box>
          <Box ml={3} h="880px">
            {catalogue.length > 0 ? (
              catalogue && catalogue.map((vehicle, index) => (
              <Container
                minW="1000px"
                boxShadow={'xl'}
                rounded={'20px'}
                p={5}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={5}
                bg="#F9F9FB"
                key={index}
                >
                <Flex direction='row' alignItems={'center'} w='98%'>
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    w={213}
                    h={120}
                    loading="lazy" />
                  <VStack align="start" spacing={0} w='100%' ml={5}>
                    <Box display="flex" w='100%' justifyContent={'space-between'}>
                      <VStack spacing={0} alignItems={'start'}>
                          <Text
                            fontSize={28}
                            mt={-1.5}>
                            {vehicle.name}
                          </Text>
                          <Text fontSize={13} mt={-1}>
                            {vehicle.brand}
                          </Text>
                      </VStack>
                      <HStack align={'start'} justify={'space-between'}>
                          <Flex w="100%" align="end">
                            <Text fontSize={28}>
                                Rp{vehicle.price.toLocaleString('id-ID')}
                            </Text>
                            <Text fontSize={14}>
                                /day
                            </Text>
                          </Flex>
                      </HStack>
                    </Box>
                    <Box w='100%'>
                      <HStack>
                        <GoPersonFill size={25}/>
                        <Text fontSize={13}>
                            {vehicle.capacity}
                        </Text>
                        <Spacer />
                        <GiGearStickPattern size={25}/>
                        <Text fontSize={13}>
                            {getTransmission(vehicle)}
                        </Text>
                        <Spacer />
                        { type === 'Car' ? (
                          <>
                            <BsCarFrontFill size={25}/>
                            <Text fontSize={13}>
                                {vehicle.size}
                            </Text>
                          </>
                        ) : (
                          <>
                            <FaMotorcycle size={25}/>
                            <Text fontSize={13}>
                                {vehicle.size}
                            </Text>
                          </>
                        )}
                        <Spacer />
                        <MdOutlineStar size={25}/>
                        <Text fontSize={13}>
                            {vehicle.rating}
                        </Text>
                        <Box flex={'15'}>
                          <Spacer/>
                        </Box>
                        <Button 
                          onClick={() => handleRentNow(vehicle)}
                          fontSize="16px"
                          bg="#E84D83" 
                          color="#F9F9FB" 
                          borderRadius="20px" 
                          mt={2} 
                          width="170px" 
                          height="40px" 
                          _hover={{ bg: "#E84D83" }}
                          fontWeight="normal">
                          Rent Now
                        </Button>
                      </HStack>
                    </Box>
                  </VStack>  
                </Flex> 
              </Container>
              ))
            ) : (
              <Text color="#F9F9FB" fontSize="17px">No matching result.</Text>
            )}
          </Box>
        </HStack>
        <Box mb={6} w="100%" display="flex" justifyContent="center">
          <Button
            isDisabled={page === 1}
            onClick={() => setPage((prevPage) => prevPage - 1)}
            bg="transparent"
            color="#F9F9FB"
            _active={{ bg: 'transparent' }}
            _hover={{ bg: 'transparent' }}>
            <ChevronLeftIcon />
          </Button>

          {Array.from({ length: Math.ceil(catalogueLength / pageSize) }, (_, i) => i + 1).map((pageNum) => (
          <Button
              key={pageNum}
              isActive={pageNum === page}
              onClick={() => setPage(pageNum)}
              bg="transparent"
              color="#F9F9FB"
              fontWeight={pageNum === page ? "bold" : "normal"}
              _active={{ bg: 'transparent' }}
              _hover={{ bg: 'transparent' }}>
              {pageNum}
          </Button>
          ))}

          <Button
            isDisabled={page === Math.ceil(catalogueLength / pageSize)}
            onClick={() => setPage((prevPage) => prevPage + 1)}
            bg="transparent"
            color="#F9F9FB"
            _active={{ bg: 'transparent' }}
            _hover={{ bg: 'transparent' }}>
            <ChevronRightIcon />
          </Button>
        </Box>
    </Flex>
  )
}

export function getTransmission(vehicle: any) {
  if (vehicle.transmission === 'Automatic') {
    return 'A/T';
  }
  else if (vehicle.transmission === 'Manual') {
    return 'M/T';
  }
}