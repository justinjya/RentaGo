'use client'

import {
  Box,
  Flex,
  Stack,
  Center,
  Text,
  Input,
  Button,
  FormLabel,
  VStack,
  Image,
  HStack,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Spacer,
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalBody, 
  ModalFooter, 
  useDisclosure,
  ModalHeader,
  ModalCloseButton
} from '@chakra-ui/react'
import BackButton from '../components/BackButton'
import { PressEnterAble } from '../components/PressEnterAble';
import { ChevronDownIcon, ChevronUpIcon, WarningIcon } from '@chakra-ui/icons';
import { GoCheckCircleFill } from "react-icons/go";
import { useState, useEffect } from "react";
import { format } from 'date-fns'
import { useNavigate } from "react-router-dom";
import { useSupabase } from '../services/supabaseService';
import { useAuth } from '../services/authContext';
import { useDetails } from '../services/detailsContext';
import { pay } from '../services/payService';
import { getFinalPrice } from './Rental';

export default function Payment() {
    const supabase = useSupabase();
    const { username } = useAuth();
    const { vehicle, rental, pickupDate, dropoffDate, location, resetDetails } = useDetails();
    const navigate = useNavigate();

    const adminFee = 1_500;
    const [paymentMethod, setPaymentMethod] = useState("Credit Card");
    const [creditCardNumber, setCreditCardNumber] = useState("");
    const [name, setName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [bankName, setBankName] = useState("");
    const banks = [
      { name: "BCA", virtualAccount: "1234567890", logo: "https://i.imgur.com/WyuDdll.png" },
      { name: "Mandiri", virtualAccount: "0987654321", logo: "https://i.imgur.com/k6Kv4rA.png"},
      { name: "BRI", virtualAccount: "1122334455", logo: "https://i.imgur.com/eaeS8ID.png" },
    ];
    
    const [isCreditCardNumberNotValid, setIsCreditCardNumberNotValid] = useState(false);
    const [isExpiryDateNotValid, setIsExpiryDateNotValid] = useState(false);
    const [isCVVNotValid, setIsCVVNotValid] = useState(false);
        
    const { isOpen: isOpenPay, onOpen: onOpenPay, onClose: onClosePay } = useDisclosure();
    const { isOpen: isOpenBack, onOpen: onOpenBack, onClose: onCloseBack } = useDisclosure();

    useEffect(() => {
        if (pickupDate && dropoffDate && vehicle === null) {
            navigate('/catalogue');
            return;
        }
        else if (!pickupDate || !dropoffDate || location === "" || vehicle === null) {
            navigate('/');
            return;
        }
    })

    const handleBack = () => {
        onOpenBack();
    };

    const handlePayNow = () => {
        if ((paymentMethod === "Credit Card" && (!creditCardNumber || !expiryDate || !cvv)) ||
            (paymentMethod === "M-Banking" && !bankName)) {
            return
        }
        
        if (paymentMethod === "Credit Card" && (creditCardNumber.length < 14 || expiryDate.length < 5 || cvv.length < 3)) {
            if (creditCardNumber.length < 14) {
                setIsCreditCardNumberNotValid(true);
            }
            if (expiryDate.length < 5) {
                setIsExpiryDateNotValid(true);
            }
            if (cvv.length < 3) {
                setIsCVVNotValid(true);
            }
            return
        }

        onOpenPay();
        handlePayment(supabase, vehicle, pickupDate, dropoffDate, adminFee, rental, paymentMethod, "Pending", username)

        const timer = setTimeout(() => {
            onClosePay();
            navigate("/");
            resetDetails();
        }, 2000);

        return () => {
            clearTimeout(timer);
        };
    };

  return (
    vehicle &&
    <Flex direction="column">
        <Flex align="center" justify="space-between" h="131px" px="80px">
            <BackButton onClick={handleBack}/>
            <HStack spacing="190px">
                <HStack spacing="16px">
                    <Center boxSize="30px" borderRadius="50%" border="1px solid rgba(249, 249, 251, 0.7)">
                        <Text fontSize="md" color="rgba(249, 249, 251, 0.7)">1</Text>
                    </Center>
                    <Text fontSize="18px" color="rgba(249, 249, 251, 0.7)">Rental Details</Text>
                </HStack>
                <HStack spacing="16px">
                    <Center boxSize="30px" bg="#D9D9D9" borderRadius="50%">
                        <Text fontSize="md">2</Text>
                    </Center>
                    <Text fontSize="18px" color={'#F9F9FB'}>Payment Details</Text>
                </HStack>
                <Box w="215px"></Box>
            </HStack>
        </Flex>
        <Modal isOpen={isOpenBack} onClose={onCloseBack} isCentered>
            <ModalOverlay />
            <ModalContent w="500px" h="312px" rounded={20} maxW="none">
                <ModalHeader fontSize={28}>Exit this page?</ModalHeader>
                <ModalCloseButton />
                <ModalBody fontSize={20}>
                Are you sure you want to go back? If you exit this page, your booking will be cancelled.
                </ModalBody>

                <ModalFooter>
                <Button bg={"#F9F9B"} mr={3} onClick={onCloseBack} border="1px solid #000000" rounded={20}>
                    Cancel
                </Button>
                <Button bg="#E84C83" color="#F9F9FB" rounded={20} _hover={{}} onClick={() => {
                    handlePayment(supabase, vehicle, pickupDate, dropoffDate, adminFee, rental, paymentMethod, "Failed", username)
                    onCloseBack();
                    resetDetails();
                    navigate("/");
                }}>
                    Confirm
                </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
            <Flex direction="row" justify="center" gap="20px">
            <Box>
                <Stack
                    w="550px" 
                    h="525px"
                    bg={'transparent'}
                    mt="0px"
                    rounded={20}
                    pt={8}
                    spacing={{ base: 8 }}>
                    <Stack spacing={4}>
                        <Text
                        color={'#F9F9FB'}
                        lineHeight={1.1}
                        fontSize={32}
                        fontWeight={400}
                        textAlign="start">
                        Payment Method
                        </Text>
                        <Box position="relative" borderBottom="2px solid #F9F9FB"> 
                            <ButtonGroup>
                                <Button 
                                    onClick={() => setPaymentMethod("Credit Card")} 
                                    rounded={0}
                                    bg={"transparent"}
                                    color={'#F9F9FB'}
                                    _hover={{bg: 'transparent'}}
                                    _after={{
                                        content: '""',
                                        display: paymentMethod === "Credit Card" ? "block" : "none",
                                        position: "absolute",
                                        bottom: "-2px",
                                        left: "0",
                                        right: "0",
                                        height: "2px",
                                        bg: "#E84C83",
                                    }}>
                                    Credit Card
                                </Button>
                                <Button
                                    onClick={() => setPaymentMethod("M-Banking")} 
                                    rounded={0}
                                    bg={"transparent"}
                                    color={'#F9F9FB'}
                                    _hover={{bg:"transparent"}}
                                    _after={{
                                        content: '""',
                                        display: paymentMethod === "M-Banking" ? "block" : "none",
                                        position: "absolute",
                                        bottom: "-2px",
                                        left: "0",
                                        right: "0",
                                        height: "2px",
                                        bg: "#E84C83",
                                    }}>
                                    M-Banking
                                </Button>
                                <Button
                                    onClick={() => setPaymentMethod("QRIS")}
                                    rounded={0}
                                    bg={"transparent"}
                                    color={'#F9F9FB'}
                                    _hover={{bg:"transparent"}}
                                    _after={{
                                        content: '""',
                                        display: paymentMethod === "QRIS" ? "block" : "none",
                                        position: "absolute",
                                        bottom: "-2px",
                                        left: "0",
                                        right: "0",
                                        height: "2px",
                                        bg: "#E84C83",
                                    }}>
                                    QRIS
                                </Button> 
                            </ButtonGroup>
                        </Box>
                        <PressEnterAble handleSubmit={handlePayNow}>
                            {paymentMethod === "Credit Card" && (
                            <Stack mt={4}>
                                <FormLabel fontSize={15} color={'#F9F9FB'}>Credit Card Number</FormLabel>
                                <Input
                                value={creditCardNumber} onChange={e => {
                                    const val = e.target.value;
                                    if (val.length > 16) return;
                                    if (!isNaN(Number(val))) {
                                        setCreditCardNumber(e.target.value);
                                    }
                                }}
                                bg={'#F9F9FB'}
                                border={0}
                                mb={4}
                                h="50px"
                                w="65%"
                                borderRadius={20}
                                boxShadow={isCreditCardNumberNotValid ? "0 0 0 1px red" : "0 0 0 0"} 
                                sx={isCreditCardNumberNotValid ? { ":focus": { boxShadow: "0 0 0 1.5px red" } } : {}}
                                _hover={{
                                    bg: "#E2E8F0" }}
                                />
                                {isCreditCardNumberNotValid && 
                                <Flex direction="row" w="370px" align="center" mt="-11px">
                                    <WarningIcon color="red" w={4} h={4} />
                                    <Text color="red" fontSize="sm" mt={0} mb={0} ml={3} mr={3} textAlign="center">
                                    Credit card number must contain at least 14 digits
                                    </Text>
                                </Flex>
                                }
                                <FormLabel fontSize={15} color={'#F9F9FB'}>Name</FormLabel>
                                    <Input
                                    value={name} onChange={e => {
                                        const val = e.target.value;
                                        if (val.length > 30) return;
                                        setName(e.target.value)
                                    }}
                                    bg={'#F9F9FB'}
                                    border={0}
                                    mb={4}
                                    h="50px"
                                    w="65%"
                                    borderRadius={20}
                                    _hover={{
                                        bg: "#E2E8F0" }}
                                />
                                <Flex gap={-8}>
                                    <Stack mr={-10}>
                                        <FormLabel fontSize={15} color={'#F9F9FB'}>Expiration Date</FormLabel>
                                        <Input
                                        value={expiryDate} onChange={e => {
                                            let val = e.target.value;
                                            val = val.replace(/[^0-9]/g, '');
                                            if (val.length > 2) {
                                                val = val.slice(0, 2) + '/' + val.slice(2);
                                            }
                                            if (val.length <= 5) {
                                                setExpiryDate(val);
                                            }
                                        }}
                                        bg={'#F9F9FB'}
                                        border={0}
                                        mb={4}
                                        h="50px"
                                        w="70%"
                                        borderRadius={20}
                                        boxShadow={isExpiryDateNotValid ? "0 0 0 1px red" : "0 0 0 0"} 
                                        sx={isExpiryDateNotValid ? { ":focus": { boxShadow: "0 0 0 1.5px red" } } : {}}
                                        _hover={{
                                        bg: "#E2E8F0" }}
                                        />
                                        {isExpiryDateNotValid && 
                                        <Flex direction="row" w="170px" align="start" mt="-11px">
                                            <WarningIcon color="red" w={4} h={4} />
                                            <Text color="red" fontSize="sm" mt={0} mb={0} ml={3} mr={3} textAlign="start">                                  
                                                Use MM/YY format
                                            </Text>
                                        </Flex>
                                        }
                                    </Stack>
                                    <Stack ml="20px">
                                        <FormLabel fontSize={15} color={'#F9F9FB'}>CVV</FormLabel>
                                        <Input
                                        value={cvv} onChange={e => {
                                            const val = e.target.value;
                                            if (val.length > 4) return;
                                            if (!isNaN(Number(val))) {
                                                setCvv(e.target.value);
                                            }
                                        }}
                                        bg={'#F9F9FB'}
                                        border={0}
                                        mb={4}
                                        h="50px"
                                        w="93%"
                                        borderRadius={20}
                                        boxShadow={isCVVNotValid ? "0 0 0 1px red" : "0 0 0 0"} 
                                        sx={isCVVNotValid ? { ":focus": { boxShadow: "0 0 0 1.5px red" } } : {}}
                                        _hover={{
                                            bg: "#E2E8F0" }}
                                        />
                                        {isCVVNotValid && 
                                        <Flex direction="row" w="300px" align="center" mt="-11px">
                                            <WarningIcon color="red" w={4} h={4} />
                                            <Text color="red" fontSize="sm" mt={0} mb={0} ml={3} mr={3} textAlign="center">
                                            CVV must contain at least 3 digits
                                            </Text>
                                        </Flex>
                                        }
                                    </Stack>
                                </Flex>
                            </Stack>
                            )}
                            {paymentMethod === "M-Banking" && (
                            <Stack mt={4}>
                                <FormLabel fontSize={15} color={'#F9F9FB'}>Bank Name</FormLabel>
                                <Menu placement="bottom-start" offset={[0, -20]}>
                                    {({ isOpen }) => (
                                    <>
                                        <MenuButton as={Button} w="270px" h="50px" bg={'#F9F9FB'} fontWeight="normal" textAlign="start" borderRadius="20px" rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} zIndex={3} _hover={{ bg: "#E2E8F0" }} _expanded={{ bg: "#F9F9FB"}}>
                                        {bankName}
                                        </MenuButton>
                                        <MenuList position="fixed" bg={'#F9F9FB'} w="270px"  borderRadius="0 0 20px 20px" zIndex={2}>
                                        <Box>
                                            <Spacer h="3px" />
                                        </Box>
                                        <MenuDivider/>
                                        {banks.map((value, index, array) => renderBanksMenuItem(value, index, array, setBankName))}
                                        </MenuList>
                                    </>
                                    )}
                                </Menu>
                                {bankName !== "" &&
                                  <VStack align="start" mt={5}>
                                      <Text color={'#F9F9FB'} fontWeight={'normal'}>Virtual Account</Text>
                                      <Text color={'#F9F9FB'}>{getVirtualAccount(banks, bankName)}</Text>
                                  </VStack>
                                }
                            </Stack>
                            )}
                            {paymentMethod === "QRIS" && (
                                <Image
                                mt={4}
                                src="https://i.imgur.com/TmOJxj8.png"
                                alt="QRIS"
                                w="300px"
                                h="300px"
                                mr={5}/>
                            )}
                        </PressEnterAble>
                    </Stack>
                </Stack>
            </Box>
            <Box sx={{background:"rgba(255, 255, 255, 0.05)" ,backdropFilter:"blur(10px)"}} rounded={20}>
                <Stack
                    w="500px" 
                    h="525px"
                    mt="0px"
                    rounded={20}
                    p={{ base: 4, sm: 6, md: 8 }}
                    spacing={3}>
                    <Text color={"#F9F9FB"} fontSize={32}
                        fontWeight={400}>Order Summary</Text>
                    <HStack mt={4}>
                        <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        w="160px"
                        h="120px"
                        objectFit="scale-down"
                        mr={5}/>
                        <VStack spacing={0} align="start">
                            <Text fontSize={20} color={'#F9F9FB'}>{vehicle.name}</Text>
                            <Text fontSize={18} color={'#F9F9FB'} mb={2}>{vehicle.brand}</Text>
                            <Text fontSize={15} color={'#F9F9FB'}>{format(new Date(pickupDate), 'dd/MM/yyy')} - {format(new Date(dropoffDate), 'dd/MM/yyyy')}</Text>
                            <Text fontSize={15} color={'#F9F9FB'}>{vehicle.location}</Text>
                        </VStack>
                    </HStack>
                    <HStack justify="center" mt={4}>
                        <VStack spacing={1} align="start" w={200}>
                            <Text fontSize="15px" color={'#F9F9FB'}>Subtotal</Text>
                        </VStack>
                        <VStack spacing={1} align="left" w={150}>
                            <Text fontSize="15px" color={'#F9F9FB'}>Rp {getFinalPrice(vehicle, pickupDate, dropoffDate).toLocaleString('id-ID')}</Text>
                        </VStack>
                    </HStack>
                    <HStack justify="center" mt={3}>
                        <VStack spacing={1} align="start" w={200}>
                            <Text fontSize="15px" color={'#F9F9FB'}>Admin fee (if applicable)</Text>
                        </VStack>
                        <VStack spacing={1} align="left" w={150}>
                            <Text fontSize="15px" color={'#F9F9FB'}>Rp {adminFee.toLocaleString('id-ID')}</Text>
                        </VStack>
                    </HStack>
                    <HStack justify="center" mt={4}>
                        <VStack spacing={1} align="start" w={200}>
                            <Text fontSize="20px" color={'#F9F9FB'}>Total</Text>
                        </VStack>
                        <VStack spacing={1} align="left" w={150}>
                            <Text fontSize="20px" color={'#F9F9FB'}>Rp {getTotalPrice(vehicle, pickupDate, dropoffDate, adminFee).toLocaleString('id-ID')}</Text>
                        </VStack>
                    </HStack>
                    <Button
                        onClick={handlePayNow}
                        fontFamily={'heading'}
                        h="50px"
                        borderRadius={20}
                        mt={8}
                        w={'full'}
                        bg={'#E84C83'}
                        color={'white'}
                        opacity={(paymentMethod === "Credit Card" && (!creditCardNumber || !expiryDate || !cvv)) || (paymentMethod === "M-Banking" && !bankName) ? 0.6 : 1}
                        _hover={{
                            bg:'#E84C83',
                        }}
                    >
                        Pay Now
                    </Button>
                    <Modal isOpen={isOpenPay} onClose={onClosePay} isCentered>
                        <ModalOverlay />
                        <ModalContent w="600px" h="312px" rounded={20} maxW="none">
                            <ModalBody>
                            <Flex direction="column" justifyContent="center" alignItems="center" height="100%">
                                <GoCheckCircleFill size={90}/>
                                <Text fontSize={30} mt={5} mb={-5}>Your payment is being processed...</Text>
                            </Flex>
                            </ModalBody>
                            <ModalFooter>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Stack>
            </Box>
        </Flex>
    </Flex>
  )
}

const renderBanksMenuItem = (bank: { name: string, logo: string }, index: number, array: any[], setBankName: any) => {
    const isLastIndex = index === array.length - 1;

    if (isLastIndex) {
        return (
            <MenuItem 
                key={index} 
                onClick={() => {
                  setBankName(bank.name);
                }}
                borderRadius="0 0 10px 10px"
                _hover={{ bg: "#E2E8F0" }}
            >
                <Flex gap={3}>
                  <Image src={bank.logo} alt={bank.name + ' logo'} boxSize="20px"/>
                  {bank.name}
                </Flex>
            </MenuItem>
        )
    }

    return (
        <MenuItem 
            key={index} 
            onClick={() => {
              setBankName(bank.name);
            }}
            _hover={{ bg: "#E2E8F0" }}
        >
            <Flex gap={3}>
              <Image src={bank.logo} alt={bank.name + ' logo'} boxSize="20px"/>
              {bank.name}
            </Flex>
        </MenuItem>
    );
};

function getTotalPrice(vehicle: any, pickupDate: Date, dropoffDate: Date, adminFee: number) {
    const finalPrice = getFinalPrice(vehicle, pickupDate, dropoffDate)
    return finalPrice + adminFee;
}

function handlePayment(supabase: any, vehicle: any, pickupDate: Date, dropoffDate: Date, adminFee: number, rental: any, paymentMethod: string, status: string, username: string) {
    const totalPrice = getTotalPrice(vehicle, pickupDate, dropoffDate, adminFee);
    const rent_id = rental.rent_id
    pay(supabase, paymentMethod, totalPrice, status, username, rent_id)
}

function getVirtualAccount(banks: { name: string, virtualAccount: string }[], bankName: string) {
    const selectedBank = banks.find(bank => bank.name === bankName)
    const virtualAccount = selectedBank ? selectedBank.virtualAccount : ''
    return virtualAccount
}