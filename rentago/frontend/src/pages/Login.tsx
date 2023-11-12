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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../services/auth-provider'

export default function LoginPage() {
    const { handleLogin } = useContext(AuthContext)
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [loginFailed, setLoginFailed] = useState(false)
    const handleLoginAndRedirect = async () => {
        const isLoginSuccess = await handleLogin(username, password)
        if (isLoginSuccess) {
            navigate('/')
        }
        else {
            setLoginFailed(true);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [email, setEmail] = useState('')
    const openModal = () => {
        setIsModalOpen(true)
    };
    const closeModal = () => {
        setIsModalOpen(false)
        setEmail('')
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    };

    const handleSendResetLink = () => {
        setEmail('')
        setIsModalOpen(false)
    };

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
                    <Text fontSize={'5xl'} color="#F9F9FB" mb={10}>Login</Text>
                    <FormControl id="username" mb={3}>
                        <FormLabel color="#F9F9FB">Username</FormLabel>
                        <Input
                            value={username} 
                            bg="#D9DDE9" 
                            border={"2px"} 
                            borderColor={loginFailed ? "#B50F0F" : "transparent"}
                            _hover={{
                                border: "2px", 
                                borderColor: loginFailed ? "#B50F0F" : "transparent"}} 
                            color="#000000" 
                            type="username" 
                            borderRadius="15px" 
                            onChange={(e) => setUsername(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') handleLoginAndRedirect() }}
                            required />
                    </FormControl>
                    <FormControl id="password">
                        <FormLabel color="#F9F9FB">Password</FormLabel>
                        <Input 
                            value={password} 
                            bg="#D9DDE9" 
                            border={"2px"} 
                            borderColor={loginFailed ? "#B50F0F" : "transparent"}
                            _hover={{
                                border: "2px", 
                                borderColor: loginFailed ? "#B50F0F" : "transparent"}} 
                            color="#000000" 
                            type="password" 
                            borderRadius="15px" 
                            onChange={(e) => setPassword(e.target.value)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') handleLoginAndRedirect() }}
                            required />
                    </FormControl>
                    <Link ml={3} color="#F9F9FB" mt={2} mb={4} fontSize="sm" onClick={openModal} cursor="pointer">
                        Forgot password?
                    </Link>
                        <Button 
                            bg="#E84C83" color="#F9F9FB" variant={'solid'} height="45px" width="300px" borderRadius="20px" mt={10} onClick={handleLoginAndRedirect}>
                            Login
                        </Button>
                    <Link href={'register'} ml={3} color="#F9F9FB" mt={2} mb={4} fontSize="sm" cursor="pointer">
                            I don't have an account
                    </Link>
                </Stack>
            </Flex>
            <Modal isOpen={isModalOpen} onClose={closeModal} size="md" isCentered>
                <ModalOverlay  />
                <ModalContent >
                    <ModalHeader fontSize={'2xl'}>Forgot Your Password?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="email">
                        <FormLabel>Get a reset link through your email</FormLabel>
                        <Input type="email" value={email} onChange={handleEmailChange} />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button bg="#679CF8" color="#FFFFFF" variant={'solid'} height="45px" width="417px" borderRadius="20px" onClick={handleSendResetLink}>
                        Send Reset Link
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Stack>
        </Box>
  )
}