'use client'

import {
  Button,
  Box,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../services/auth-provider'

export default function RegisterPage() {
    const { handleRegister } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [registerFailed, setRegisterFailed] = useState(false);

    const handleRegisterAndRedirect = async () => {
        const isRegisterSuccess = await handleRegister(username, email, password)
        if (isRegisterSuccess) {
            navigate('/')
        }
        else {
            setRegisterFailed(true);
        }
    }

    return (
        <Box
        bgGradient="linear(#000000, #2C2B64, #504497)"
        w="100vw"
        h="100vh"
        overflowY="hidden">
        <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex flex={2}></Flex>
            <Flex p={50} flex={1} align={'center'} justify={'center'} backgroundColor={'rgba(0, 0, 0, 0.2)'} backdropFilter="blur(10px)">
                <Stack margin={50} spacing={4} w={'full'} maxW={'md'} align={'center'} justify={'center'}>
                    <Text fontSize={'5xl'} color="#F9F9FB" mb={10}>Register</Text>
                    <FormControl id="email" mb={3}>
                        <FormLabel color="#F9F9FB">Email</FormLabel>
                        <Input 
                            bg="#D9DDE9" 
                            borderColor={registerFailed ? "#B50F0F" : "transparent"}
                            _hover={{
                                border: "2px", 
                                borderColor: registerFailed ? "#B50F0F" : "transparent"}} 
                            color="#000000" 
                            type="email" 
                            borderRadius="15px" 
                            onChange={(e) => setEmail(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') handleRegisterAndRedirect() }}
                            required />
                    </FormControl>
                    <FormControl id="username" mb={3}>
                        <FormLabel color="#F9F9FB">Username</FormLabel>
                        <Input 
                            bg="#D9DDE9" 
                            border={"2px"} 
                            borderColor={registerFailed ? "#B50F0F" : "transparent"}
                            _hover={{
                                border: "2px", 
                                borderColor: registerFailed ? "#B50F0F" : "transparent"}} 
                            color="#000000" 
                            type="username" 
                            borderRadius="15px"
                            onChange={(e) => setUsername(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') handleRegisterAndRedirect() }}
                            required />
                    </FormControl>
                    <FormControl id="password">
                        <FormLabel color="#F9F9FB">Password</FormLabel>
                        <Input 
                            bg="#D9DDE9" 
                            borderColor={registerFailed ? "#B50F0F" : "transparent"}
                            _hover={{
                                border: "2px", 
                                borderColor: registerFailed ? "#B50F0F" : "transparent"}} 
                            color="#000000" 
                            type="password" 
                            borderRadius="15px" 
                            onChange={(e) => setPassword(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') handleRegisterAndRedirect() }}
                            required />
                    </FormControl>
                    <Stack spacing={10} align={'center'} justify={'center'}>
                        <Button bg="#E84C83" color="#F9F9FB" variant={'solid'} height="45px" width="300px" borderRadius="20px" mt={10} onClick={handleRegisterAndRedirect}>
                            Register
                        </Button>
                    </Stack>
                    <Link href={'login'} ml={3} color="#F9F9FB" mt={2} mb={4} fontSize="sm" cursor="pointer">
                            I have an account
                    </Link>
                </Stack>
            </Flex>
        </Stack>
        </Box>
  )
}