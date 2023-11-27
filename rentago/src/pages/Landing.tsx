'use client'
import React from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { ChevronDownIcon, ChevronUpIcon, CalendarIcon} from '@chakra-ui/icons'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { addMonths, format } from 'date-fns';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box, 
  Tab, 
  TabList, 
  Tabs, 
  Text, 
  VStack, 
  HStack, 
  Spacer, 
  Button, 
  Flex, 
  Center, 
  Image,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuDivider,
} from '@chakra-ui/react'
import { StarRating } from '../components/StarRating'
import { DatePicker } from '../components/DatePicker'
import { useDetails } from '../services/detailsContext'
import { useSupabase } from '../services/supabaseService'
import { getLocations } from '../services/catalogueService'
import motorbikeImage from '../assets/bike.svg'
import carImage from '../assets/car.svg'

const LandingPage: React.FC = () => {
  const supabase = useSupabase();
  const { 
    setType, 
    pickupDate, setPickupDate,
    dropoffDate, setDropoffDate,
    location, setLocation,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    transmission, setTransmission,
    capacity, setCapacity,
    size, setSize,
    rating, setRating,
    rental,
  } = useDetails();
  const [locations, setLocations] = useState<string[]>([]);
  useEffect(() => {
    if (rental) {
      navigate("/pay");
    }

    const fetchLocations = async () => {
      const data = await getLocations(supabase);

      if (data) {
        setLocations(data);
      }
    }

    fetchLocations();
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
	const [nextMonth, setNextMonth] = useState(addMonths(currentMonth, 1));
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const handleAccordionChange = () => {
    setIsExpanded(!isExpanded);
  };

  const predefinedFilterValues = {
    'transmission': [null, 'Automatic', 'Manual'],
    'capacity': [null, 5, 7, 9],
    'size': [null, 'Small', 'Medium', 'Large'],
  }
  
  const [tabIndex, setTabIndex] = useState(0);

  const navigate = useNavigate();
  const handleSubmit = () => {
    if (pickupDate === null || dropoffDate === null || location === null || tabIndex === 1) {
      return;
    }

    navigate("/catalogue");
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', width: '100%' , height: 'calc(100vh - 64px)', overflow: 'hidden'}}>
      <Box
        w="100%"
        h="100%"
        display="flex"
        flexDirection="column"
        justifyContent="start"
        alignItems="center"
        overflow="hidden"
        mt="150px"
        mb="50px"
        zIndex="1">
        <Flex position="fixed" w="100%" h="87%" align="end" justify={tabIndex === 0 ? "end" : "start"} zIndex="0" overflow="hidden">
          <Image
            src={tabIndex === 0 ? carImage : motorbikeImage}
            width={tabIndex === 0 ? "61%": "25%"}
            height={tabIndex === 0 ? "61%": "55%"}
            zIndex="0"
          />
        </Flex>
        <Text fontSize="6xl" textColor="#F9F9FB" >
          RentaGo
        </Text>
        <Text fontSize="20px" mb="30" textColor="#F9F9FB">
          Easy Renting, Endless Exploring.
        </Text>
        <Tabs onChange={(index) => {setTabIndex(index); index === 0 ? setType("Car") : setType("Motorcycle");}} isFitted w="1100px" backgroundColor="#F9F9FB" borderRadius={20}>
          <TabList mb="1em">
            <Tab _selected={{ color: "black", borderBottom: "2px solid #E84C83" }} borderTopLeftRadius={20} onClick={() => {if (isOpen) setIsOpen(false)}}>Car Rental</Tab>
            <Tab _selected={{ color: "black", borderBottom: "2px solid #E84C83" }} borderTopRightRadius={20} onClick={() => {if (isOpen) setIsOpen(false)}}>Motorcycle Rental</Tab>
          </TabList>
          <Box bg="#F9F9FB" w="1100px" borderBottomRadius={ isExpanded ? 0 : 20 } pb={isExpanded ? 5 : 0}>
            <Center>
              <HStack>
                <VStack>
                  <HStack spacing={14} width="100%">
                    <VStack alignItems="start">
                      <Text mb={0}>Pick-up Date</Text>
                      <Button
                        w="270px"
                        h="45px"
                        fontWeight={"normal"}
                        borderRadius={20}
                        bg="#D9DDE9"
                        color={pickupDate ? "black" : "rgba(0, 0, 0, 0.25)"}
                        justifyContent="start"
                        iconSpacing={5}
                        leftIcon={<CalendarIcon color="black" />}
                        onClick={() => setIsOpen(!isOpen)}
                        >
                        {pickupDate ? format(new Date(pickupDate), 'dd/MM/yyyy') : 'Required'}
                      </Button>
                    </VStack>
                    <VStack alignItems="start">
                      <Text mb={0}>Drop-off Date</Text>
                      <Button
                        w="270px"
                        h="45px"
                        fontWeight={"normal"}
                        borderRadius={20}
                        bg="#D9DDE9"
                        color={dropoffDate ? "black" : "rgba(0, 0, 0, 0.25)"}
                        justifyContent="start"
                        iconSpacing={5}
                        leftIcon={<CalendarIcon color="black" />}
                        onClick={() => setIsOpen(!isOpen)}
                        >
                        {dropoffDate ? format(new Date(dropoffDate), 'dd/MM/yyyy') : 'Required'}
                      </Button>
                    </VStack>
                    <VStack alignItems="start">
                      <Text mb={0}>Location</Text>
                      <Menu placement="bottom-start" offset={[0, -20]}>
                        {({ isOpen }) => (
                          <>
                            <MenuButton as={Button} w="270px" h="45px" bg="#D9DDE9" color={location ? "black" : "rgba(0, 0, 0, 0.25)"} fontWeight="normal" textAlign="start" borderRadius="20px" leftIcon={<FaLocationDot color="black"/>} rightIcon={isOpen ? <ChevronUpIcon color="black" /> : <ChevronDownIcon color="black" />} zIndex={7} _expanded={{ bg: "#D9DDE9"}} onClick={() => setIsOpen(false)}>
                              {location ? location : "Required"}
                            </MenuButton>
                            <MenuList position="fixed" style={{ maxHeight: '255px', overflow: 'auto' }} bg="#D9DDE9" w="270px" borderRadius="0 0 20px 20px" zIndex={6}>
                              <Box>
                                <Spacer h="3px" />
                              </Box>
                              <MenuDivider/>
                              {locations.map((value, index, array) => renderMenuItem(value, index, array, setLocation))}
                            </MenuList>
                          </>
                        )}
                      </Menu>
                    </VStack>
                  </HStack>
                    {isOpen && (
                      <>
                        <Box position="fixed" top={0} right={0} bottom={0} left={0} zIndex={1} onClick={() => setIsOpen(false)} />
                        <Box position={"absolute"} top={isExpanded ? "90%" : "65%"} left="85px" zIndex={5000}>
                          <Box bg="#D9DDE9" w="596px" borderRadius={20}>
                            <DatePicker currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} nextMonth={nextMonth} setNextMonth={setNextMonth} startDate={pickupDate} setStartDate={setPickupDate} endDate={dropoffDate} setEndDate={setDropoffDate}/>
                          </Box>
                        </Box>
                      </>
                    )}
                  <Spacer />
                  {!isExpanded && (
                    <Button w="270px" h="45px" bg="#E84C83" borderRadius={20} textColor="#FFFFFF" mb={30} opacity={pickupDate === null || dropoffDate === null || location === null || tabIndex === 1 ? 0.6 : 1} onClick={handleSubmit} _hover={{}} _active={{}}>
                      Submit
                    </Button>
                  )}
                </VStack>
                <Spacer />
              </HStack>
            </Center>
          </Box>
        </Tabs>
        <Accordion allowToggle onChange={handleAccordionChange} zIndex="1">
          <AccordionItem borderBottomRadius={20} bg={isExpanded ? "#F9F9FB" : "transparent"} borderColor={isExpanded ? "E2E8F0" : "transparent"}>
            <Flex direction="column-reverse">
              <Flex justifyContent="center" alignItems="center" w="100%">
                <AccordionButton mt={isExpanded ? "-10px" : "-1px"} w="80px" h="25px" bg="#F9F9FB" borderTopRadius={isExpanded ? 20 : 0} borderBottomRadius={isExpanded ? 0 : 20} justifyContent="center" _hover={{ bg: "#E2EBF0" }}>
                  <AccordionIcon />
                </AccordionButton>
              </Flex>
              <AccordionPanel pb={0} paddingTop={7} bg="#F9F9FB" borderBottomRadius={20} w="1100px" onClick={() => {if (isOpen) setIsOpen(false)}}>
                <HStack ml="14px" spacing={"57px"} alignItems="start" justifyContent="center">
                  <VStack alignItems="start" spacing={2}>
                    <Text>Price</Text>
                    <Flex w="100%" >
                      <RangeSlider aria-label={['min', 'max']} defaultValue={[minPrice, maxPrice]} min={200_000} max={1_500_000} step={50_000} w="230px" onChangeEnd={(val) => {setMinPrice(val[0]); setMaxPrice(val[1])}}>
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
                        <Text>Min</Text>
                        <Box bg="#D9DDE9" w="120px" h="45px" borderRadius="15" display="flex" alignItems="center" justifyContent="center">
                          Rp{minPrice.toLocaleString('id-ID')}
                        </Box>
                      </VStack>
                      <VStack alignItems={"start"} spacing={2}>
                        <Text>Max</Text>
                        <Box bg="#D9DDE9" w="120px" h="45px" borderRadius="15" display="flex" alignItems="center" justifyContent="center">
                          Rp{maxPrice.toLocaleString('id-ID')}
                        </Box>
                      </VStack>
                    </HStack>
                  </VStack>
                  <VStack alignItems="start" spacing={2}>
                    <VStack alignItems="start">
                      <Text>Transmission</Text>
                      <Menu placement="bottom-start" offset={[0, -20]}>
                        {({ isOpen }) => (
                          <>
                            <MenuButton as={Button} w="270px" h="45px" bg="#D9DDE9" fontWeight="normal" textAlign="start" borderRadius="20px" rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} zIndex={5} _expanded={{ bg: "#D9DDE9"}}>
                              {transmission}
                            </MenuButton>
                            <MenuList position="fixed" bg="#D9DDE9" w="270px" borderRadius="0 0 20px 20px" zIndex={4}>
                              <Box>
                                <Spacer h="3px" />
                              </Box>
                              <MenuDivider/>
                              {predefinedFilterValues['transmission'].map((value, index, array) => renderMenuItem(value, index, array, setTransmission))}
                            </MenuList>
                          </>
                        )}
                      </Menu>
                    </VStack>
                    <VStack alignItems="start">
                      <Text>Capacity</Text>
                      {tabIndex === 0 ? (
                      <Menu placement="bottom-start" offset={[0, -20]}>
                        {({ isOpen }) => (
                          <>
                            <MenuButton as={Button} w="270px" h="45px" bg="#D9DDE9" fontWeight="normal" textAlign="start" borderRadius="20px" rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} zIndex={3} _expanded={{ bg: "#D9DDE9"}}>
                              {capacity}
                            </MenuButton>
                            <MenuList position="fixed" bg="#D9DDE9" w="270px"  borderRadius="0 0 20px 20px" zIndex={2}>
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
                        <Button w="270px" h="45px" bg="#D9DDE9" fontWeight="normal" textAlign="start" justifyContent="start" borderRadius="20px" _hover={{}} isDisabled>
                          2
                        </Button>
                      )}
                    </VStack>
                    <VStack alignItems="start" marginTop={1}>
                      {isExpanded && (
                        <Button w="270px" h="45px" bg="#E84C83" marginBottom={30} borderRadius={20} textColor="#FFFFFF" mt={30} opacity={pickupDate === null || dropoffDate === null || location === null || tabIndex === 1 ? 0.6 : 1} onClick={handleSubmit} _hover={{}} _active={{}}>
                          Submit
                        </Button>
                      )}
                    </VStack>
                  </VStack>
                  <VStack alignItems="start" spacing={2}>
                    <VStack alignItems="start">
                      <Text>Size</Text>
                      <Menu placement="bottom-start" offset={[0, -20]} >
                        {({ isOpen }) => (
                          <>
                            <MenuButton as={Button} w="270px" h="45px" bg="#D9DDE9" fontWeight="normal" textAlign="start" borderRadius="20px" rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} zIndex={3} _expanded={{ bg: "#D9DDE9"}}>
                              {size}
                            </MenuButton>
                            <MenuList position="fixed" bg="#D9DDE9" w="270px" borderRadius="0 0 20px 20px" zIndex={2}>
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
                    <VStack alignItems="start" zIndex="1">
                      <Text>Rating</Text>
                      <StarRating size="28" spacing="3" value={rating} onRatingChange={handleRatingChange} />
                    </VStack>
                  </VStack>
                </HStack>
              </AccordionPanel>
            </Flex>
          </AccordionItem>
        </Accordion>
      </Box>
    </div>
  );
};

export function renderMenuItem(value: any, index: number, array: any[], setState: React.Dispatch<React.SetStateAction<any>>) {
  const isLastIndex = index === array.length - 1;
  const handleClick = () => setState(value);

  if (isLastIndex) {
    return <MenuItem key={index} bg="transparent" _hover={{ bg: "#E2E8F0" }} onClick={handleClick} borderRadius="0 0 10px 10px">{value}</MenuItem>;
  }

  if (value === null) {
    return <MenuItem key={index} bg="transparent" _hover={{ bg: "#E2E8F0" }} onClick={handleClick} color="rgba(0, 0, 0, 0.25)">All</MenuItem>;
  }

  return <MenuItem bg="transparent" _hover={{ bg: "#E2E8F0" }} onClick={handleClick} key={index}>{value}</MenuItem>;
}

export default LandingPage;
