'use client'

import {
  Flex,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons';
import { useSupabase } from '../services/supabaseService';
import { useAuth } from '../services/authContext';
import { signUp } from '../services/signUpService';
import { PressEnterAble } from '../components/PressEnterAble';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const supabase = useSupabase()
  const { setUsername: setNavUsername, login, setShowLoginPage, showRegisterPage, setShowRegisterPage } = useAuth()

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordNotValid, setIsPasswordNotValid] = useState(false);
  const [isRegisterFailed, setIsRegisterFailed] = useState(false);

  useEffect(() => {
    setIsRegisterFailed(false)
    setIsPasswordNotValid(false)
    setEmail('')
    setUsername('')
    setPassword('')
  }, [showRegisterPage])

  const closeRegisterPage = () => {
    setShowRegisterPage(false)
  }

  const handleSubmit = async () => {
    if (email === '' || username === '' || password === '') {
      if (email === '' || username === '' ) {
        setIsRegisterFailed(true)
      }
      if (password.length < 6) {
        setIsPasswordNotValid(true)
        return
      }
    }

    const isRegisterSuccess = await signUp(supabase, email, username, password)

    if (isRegisterSuccess) {
      login()
      setNavUsername(username)
      closeRegisterPage()
    }
    else {
      setIsRegisterFailed(true)
    }
  }

  const handleLoginRedirect = () => {
    closeRegisterPage()
    setShowLoginPage(true)
  }

  return (
    <Modal isOpen={showRegisterPage} onClose={closeRegisterPage} isCentered>
      <ModalOverlay />
      <ModalContent mt="130px" h="590px" w="400px" borderRadius="20" backgroundColor={'#F9F9FB'} backdropFilter="blur(10px)">
        <ModalBody>
          <PressEnterAble handleSubmit={handleSubmit}>
            <Stack p="30px" pt="45px" w={'full'} maxW={'md'} align={'center'} justify={'center'}>
              <Text fontSize={'5xl'} color="black" mb="12px">Register</Text>
              <FormControl id="email" >
                <FormLabel color="black">Email</FormLabel>
                <Input bg="#D9DDE9" border={0} boxShadow={isRegisterFailed ? "0 0 0 1px red" : "0 0 0 0"} _hover={{ bg: "#E2E8F0" }} sx={isRegisterFailed ? { ":focus": { boxShadow: "0 0 0 1.5px red" } } : {}} color="black" type="email" borderRadius="15px" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              {isRegisterFailed &&
                <Flex direction="row" w="300px" align="center">
                  <WarningIcon color="red" w={4} h={4} />
                  <Text color="red" fontSize="sm" mt={0.5} mb={0} ml={3} mr={3} textAlign="center">
                    Invalid or taken email or username
                  </Text>
                </Flex>
              }
              <FormControl id="username" mt={isRegisterFailed ? 0 : 2}>
                <FormLabel color="black">Username</FormLabel>
                <Input bg="#D9DDE9" border={0} boxShadow={isRegisterFailed ? "0 0 0 1px red" : "0 0 0 0"} _hover={{ bg: "#E2E8F0" }} sx={isRegisterFailed ? { ":focus": { boxShadow: "0 0 0 1.5px red" } } : {}} color="black" type="username" borderRadius="15px" value={username} onChange={(e) => setUsername(e.target.value)} />
              </FormControl>
              <FormControl id="password" mt={2}>
                <FormLabel color="black">Password</FormLabel>
                <Input bg="#D9DDE9" border={0} boxShadow={isRegisterFailed ? "0 0 0 1px red" : "0 0 0 0"} _hover={{ bg: "#E2E8F0" }} sx={isRegisterFailed ? { ":focus": { boxShadow: "0 0 0 1.5px red" } } : {}} color="black" type="password" borderRadius="15px" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              {isPasswordNotValid &&
                <Flex direction="row" w="300px" align="center">
                  <WarningIcon color="red" w={4} h={4} />
                  <Text color="red" fontSize="sm" mt={0.5} mb={0} ml={3} mr={3} textAlign="center">
                    Password must be at least 6 characters
                  </Text>
                </Flex>
              }
              <Stack spacing={10} align={'center'} justify={'center'}>
                <Button bg="#E84C83" color="#F9F9FB" variant={'solid'} height="45px" width="300px" borderRadius="20px" mt={isPasswordNotValid ? 2 : 10} onClick={handleSubmit}>
                  Register
                </Button>
              </Stack>
              <Link ml={3} color="black" mt={3} mb={4} fontSize="sm" cursor="pointer" onClick={handleLoginRedirect}>
                I have an account
              </Link>
            </Stack>
          </PressEnterAble>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

<Flex direction="row" w="300px" align="center">
  <WarningIcon color="red" w={4} h={4} />
  <Text color="red" fontSize="sm" mt={0.5} mb={0} ml={3} mr={3} textAlign="center">
    Username or password is incorrect
  </Text>
</Flex>
