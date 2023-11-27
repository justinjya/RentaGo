'use client'

import {
  Box,
  Flex,
  Stack,
  Center,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  FormLabel,
  VStack,
  Image,
  HStack,
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalBody, 
  useDisclosure
} from '@chakra-ui/react'
import { format } from 'date-fns'
import BackButton from '../components/BackButton'
import { PressEnterAble } from '../components/PressEnterAble'
import { WarningIcon } from '@chakra-ui/icons'
import { GiGearStickPattern } from 'react-icons/gi'
import { GoPersonFill } from 'react-icons/go'
import { BsFillCarFrontFill } from 'react-icons/bs'
import { useEffect, useState } from "react";
import { useSupabase } from "../services/supabaseService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/authContext";
import { useDetails } from "../services/detailsContext";
import { getTransmission } from './Catalogue'
import { rent } from '../services/rentService'

export default function RentalPage() {
    const supabase = useSupabase()
    const navigate = useNavigate();

    const { username, isLoggedIn, setShowLoginPage, setShowRegisterPage } = useAuth();
    const { vehicle, setVehicle, rental, setRental, pickupDate, dropoffDate, location } = useDetails();
    useEffect(() => {
        if (rental) {
            navigate("/pay");
        }
        if (pickupDate && dropoffDate && vehicle === null) {
            navigate('/catalogue');
        }
        else if (!pickupDate || !dropoffDate || location === "" || vehicle === null) {
            navigate('/');
        }
        return;
    })

    const { isOpen: isLoginPopupOpen, onOpen: openLoginPopup, onClose: closeLoginPopup } = useDisclosure();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isPhoneNumberNotValid, setIsPhoneNumberNotValid] = useState(false);

    const handleBack = () => {
        setVehicle(null);
        navigate("/catalogue");
    };

    const handleConfirmOrder = async () => {
        if (!isLoggedIn) {
          openLoginPopup();
        } 
        else {
            if ((!firstName || !lastName || !phoneNumber)) {
                return;
            }
            else if (firstName && lastName && phoneNumber.length < 8) {
                setIsPhoneNumberNotValid(true);
                return;
            }
            else {
                const vehicle_id = vehicle.vehicle_id;
                const data = await rent(supabase, pickupDate, dropoffDate, firstName, lastName, phoneNumber, username, vehicle_id);
                
                if (data) {
                    const rental = data[0]
                    setRental(rental);
                }
                navigate("/pay");
            }
        }
      };

    return (
        vehicle && 
        <Flex direction="column">
            <Flex align="center" justify="space-between" h="131px" px="80px">
                <BackButton onClick={handleBack}/>
                <HStack spacing="205px">
                    <HStack spacing="16px">
                        <Center boxSize="30px" bg="#D9D9D9" borderRadius="50%">
                            <Text fontSize="md" mt="2px">1</Text>
                        </Center>
                        <Text fontSize="18px" color={'#F9F9FB'}>Rental Details</Text>
                    </HStack>
                    <HStack spacing="16px">
                        <Center boxSize="30px" borderRadius="50%" border="1px solid rgba(249, 249, 251, 0.7)">
                            <Text fontSize="md" color="rgba(249, 249, 251, 0.7)" ml="-2px" mt="2px">2</Text>
                        </Center>
                        <Text fontSize="18px" color="rgba(249, 249, 251, 0.7)">Payment Details</Text>
                    </HStack>
                    <Box w="215px"></Box>
                </HStack>
            </Flex>
            <Flex direction="row" justify="center" gap="60px">
                <Box sx={{background:"rgba(255, 255, 255, 0.05)" ,backdropFilter:"blur(10px)"}} rounded={20}> {/*Box pertama*/}
                    <Stack
                        w="470px" 
                        h="525px"
                        mt="0px"
                        p={8}
                        pt={6}
                        spacing={3}>
                        <HStack>
                            <Image
                            src={vehicle.image}
                            alt={vehicle.name}
                            w={190}
                            h={130}
                            objectFit="scale-down"
                            objectPosition="center"
                            mr={6}
                            loading="lazy"/>
                            <VStack spacing={0} align="start">
                                <Text fontSize="13px" color={'#F9F9FB'}>Final Price</Text>
                                <Text fontSize="28px" color={'#F9F9FB'}>Rp {getFinalPrice(vehicle, pickupDate, dropoffDate).toLocaleString('id-ID')}</Text>
                            </VStack>
                        </HStack>
                        <HStack justify="center">
                            <VStack spacing={0} align="start" w={198}>
                                <Text fontSize="13px" color={'#F9F9FB'}>Car Name</Text>
                                <Text fontSize="22px" color={'#F9F9FB'}>{vehicle.name}</Text>
                            </VStack>
                            <VStack spacing={0} align="start" w={168}>
                                <Text fontSize="13px" color={'#F9F9FB'}>Car Brand</Text>
                                <Text fontSize="22px" color={'#F9F9FB'}>{vehicle.brand}</Text>
                            </VStack>
                        </HStack>
                        <HStack justify="center">
                            <VStack spacing={0} align="start" w={198}>
                                <Text fontSize="13px" color={'#F9F9FB'}>Capacity</Text>
                                <HStack>
                                    <GoPersonFill size={24} color={'#F9F9FB'}/>
                                    <Text fontSize="22px" color={'#F9F9FB'} mt="1" ml="3">{vehicle.capacity}</Text>
                                </HStack>             
                            </VStack>
                            <VStack spacing={0} align="start" w={168}>
                                <Text fontSize="13px" color={'#F9F9FB'}>Transmission</Text>
                                <HStack>
                                    <GiGearStickPattern size={24} color={'#F9F9FB'}/>
                                    <Text fontSize="22px" color={'#F9F9FB'} mt="1" ml="3">{getTransmission(vehicle)}</Text>
                                </HStack>
                            </VStack>
                        </HStack>
                        <HStack justify="center">
                            <VStack spacing={1} align="start" w={198}>
                                <Text fontSize="13px" color={'#F9F9FB'}>Size</Text>
                                <HStack>
                                    <BsFillCarFrontFill size={24} color={'#F9F9FB'}/>
                                    <Text fontSize="22px" color={'#F9F9FB'} mt="1" ml="3">{vehicle.size}</Text>
                                </HStack>             
                            </VStack>   
                            <VStack w={168}></VStack>
                        </HStack>
                        <HStack justify="center">
                            <VStack spacing={0} align="start"  w={198}>
                                <Text fontSize="13px" color={'#F9F9FB'}>Pick-up Date</Text>
                                <Text fontSize="22px" color={'#F9F9FB'}>{format(new Date(pickupDate), 'dd/MM/yyyy')}</Text>
                            </VStack>
                            <VStack spacing={0} align="start" w={168}>
                                <Text fontSize="13px" color={'#F9F9FB'}>Drop-off Date</Text>
                                <Text fontSize="22px" color={'#F9F9FB'}>{format(new Date(dropoffDate), 'dd/MM/yyyy')}</Text>
                            </VStack>
                        </HStack>
                        <HStack justify="center">
                            <VStack spacing={0} align="start" w={198}>
                                <Text fontSize="13px" color={'#F9F9FB'}>Location</Text>
                                <Text fontSize="22px" color={'#F9F9FB'}>{location}</Text>
                            </VStack>   
                            <VStack w={168}></VStack>
                        </HStack>
                    </Stack>
                </Box>
                <PressEnterAble handleSubmit={handleConfirmOrder}>
                    <Stack
                    w="440px" 
                    h="525px"
                    bg={'#F9F9FB'}
                    mt="0px"
                    rounded={20}
                    p={{ base: 4, sm: 6, md: 8 }}
                    spacing={{ base: 8 }}
                    >
                        <Stack spacing={4}>
                            <Text
                            color={'gray.800'}
                            lineHeight={1.1}
                            fontSize={28}
                            fontWeight={400}
                            textAlign="center"
                            >
                                Order Details
                            </Text>
                        </Stack>
                        <Box as={'form'} mt={1} mr={5} ml={5}>
                            <Stack spacing={0}>
                                <FormLabel>First Name</FormLabel>
                                <Input
                                bg={"#D9DDE9"}
                                border={0}
                                mb={4}
                                h="50px"
                                borderRadius={20}
                                _hover={{
                                    bg: "#E2E8F0" }}
                                value={firstName} onChange={e => {
                                    const val = e.target.value;
                                    if (val.length > 30) return;
                                    setFirstName(e.target.value)
                                }}
                                />
                            </Stack>
                            <Stack spacing={0}>
                                <FormLabel>Last Name</FormLabel>
                                <Input
                                bg={"#D9DDE9"}
                                border={0}
                                mb={4}
                                h="50px"
                                borderRadius={20}
                                _hover={{
                                    bg: "#E2E8F0" }}
                                value={lastName} onChange={e => {
                                    const val = e.target.value;
                                    if (val.length > 30) return;
                                    setLastName(e.target.value)
                                }}
                                />
                            </Stack>
                            <Stack spacing={0}>
                                <FormLabel>Phone Number</FormLabel>
                                <InputGroup>
                                    <InputLeftElement
                                    paddingTop="10px"
                                    paddingLeft="20px"
                                    pointerEvents="none"
                                    color="gray.400"
                                    fontSize="16px"
                                    children="+62"
                                    />
                                    <Input
                                    type="tel"
                                    bg={"#D9DDE9"}
                                    border={0}
                                    h="50px"
                                    paddingLeft="60px"
                                    borderRadius={20}
                                    mb={2.5}
                                    boxShadow={isPhoneNumberNotValid ? "0 0 0 1px red.500" : "0 0 0 0"}
                                     _hover={{ bg: "#E2E8F0" }} 
                                     sx={isPhoneNumberNotValid ? { ":focus": { boxShadow: "0 0 0 1.5px red.500" } } : {}}
                                    value={phoneNumber} onChange={e => {
                                        const val = e.target.value;
                                        if (val.length > 12) return;
                                        if (!isNaN(Number(val))) {
                                            setPhoneNumber(e.target.value);
                                        }
                                    }}
                                    />
                                </InputGroup>
                                {isPhoneNumberNotValid && 
                                <Flex direction="row" w="300px" align="center">
                                    <WarningIcon color="red.500" w={4} h={4} />
                                    <Text color="red.500" fontSize="sm" mt={0.5} mb={0} ml={3} mr={3} textAlign="center">
                                    Phone number must be at least 8 digits
                                    </Text>
                                </Flex>
                                }
                            </Stack>
                            <Button 
                            onClick={handleConfirmOrder}
                            fontFamily={'heading'}
                            h="50px"
                            borderRadius={20}
                            mt={isPhoneNumberNotValid ? 4 : "39px"}
                            w={'full'}
                            bg={'#E84C83'}
                            color={'#F9F9FB'}
                            opacity={firstName && lastName && phoneNumber ? 1 : 0.6}
                            _hover={{
                                bg:'#E84C83',
                            }}
                            >
                                Confirm Order
                            </Button>
                            <Modal isOpen={isLoginPopupOpen} onClose={closeLoginPopup} isCentered>
                                <ModalOverlay />
                                <ModalContent w="600px" h="312px" rounded={20} maxW="none">
                                    <ModalBody>
                                    <Flex direction="column" justifyContent="center" alignItems="center" height="100%">
                                        <Text fontSize={36}>You are not logged in!</Text>
                                        <Button
                                        fontFamily={'heading'}
                                        h="50px"
                                        borderRadius={20}
                                        mt={8}
                                        mb={3}
                                        w="300px"
                                        bg={'#E84C83'}
                                        color={'#F9F9FB'}
                                        onClick={() => {closeLoginPopup(); setShowLoginPage(true);}}
                                        >
                                            Login
                                        </Button>
                                        <Button bg="transparent" h="10px" fontWeight="normal" _hover={{}} fontSize={17} mt={5} textDecoration={"underline"} onClick={() => {closeLoginPopup(); setShowRegisterPage(true)}}>I don't have an account</Button>
                                    </Flex>
                                    </ModalBody>
                                </ModalContent>
                            </Modal>
                        </Box>
                    </Stack>
                </PressEnterAble>
            </Flex>
        </Flex>
    )
}

export function getFinalPrice(vehicle: any, pickupDate: Date, dropoffDate: Date) {
    const diffTime = Math.abs(new Date(dropoffDate).getTime() - new Date(pickupDate).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return vehicle.price * diffDays;
  }