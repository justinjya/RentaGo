'use client'

import {
  Button,
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
  ModalBody,
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { MdMarkEmailRead } from "react-icons/md"
import { useSupabase } from '../services/supabaseService'
import { useAuth } from '../services/authContext'
import { signIn } from '../services/signInService'
import { PressEnterAble } from '../components/PressEnterAble'
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const supabase = useSupabase()
  const { login, showLoginPage, setShowLoginPage, setShowRegisterPage } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [isLoginFailed, setIsLoginFailed] = useState(false)
  const [isResetLinkSent, setIsResetLinkSent] = useState(false)

  useEffect(() => {
    setUsername('')
    setPassword('')
    setIsLoginFailed(false)
  }, [showLoginPage])

  const closeLoginPage = () => {
    setShowLoginPage(false)
  }

  const handleSubmit = async () => {
    const isLoginSuccess = await signIn(supabase, username, password)

    if (isLoginSuccess) {
      login(username)
      closeLoginPage()
    }
    else {
      setIsLoginFailed(true)
    }
  }

  const handleRegisterRedirect = () => {
    closeLoginPage()
    setShowRegisterPage(true)
  }

  const openForgotPasswordModal = () => {
    setIsForgotPassword(true)
  }

  const closeForgotPasswordModal = () => {
    setIsForgotPassword(false)
    setIsResetLinkSent(false)
    setEmail('')
  }

  const handleSendResetLink = () => {
    setEmail('')
    setIsResetLinkSent(true)
    const timer = setTimeout(() => {
      setIsForgotPassword(false)
      setIsResetLinkSent(false)
    }, 1060)

    return () => {
        clearTimeout(timer)
    }
  }

  return (
    <Flex>
      <Modal isOpen={showLoginPage} onClose={closeLoginPage} isCentered>
        <ModalOverlay />
        <ModalContent mt="130px" h="590px" w="400px" borderRadius="20" backgroundColor={'#F9F9FB'} backdropFilter="blur(10px)">
          <ModalBody >
            <PressEnterAble handleSubmit={handleSubmit}>
              <Stack p="30px" pt="60px" spacing={4} w={'full'} maxW={'md'} align={'center'} justify={'center'}>
                <Text fontSize={'5xl'} color="black" mb={3}>Login</Text>
                <FormControl id="username" mb={0}>
                  <FormLabel color="black">Username</FormLabel>
                  <Input bg="#D9DDE9" border={0} boxShadow={isLoginFailed ? "0 0 0 1px red" : "0 0 0 0"} _hover={{ bg: "#E2E8F0" }} sx={isLoginFailed ? { ":focus": { boxShadow: "0 0 0 1.5px red" } } : {}} color="black" type="username" borderRadius="15px" value={username} onChange={(e) => setUsername(e.target.value)} />
                </FormControl>
                {isLoginFailed && 
                  <Flex direction="row" w="300px" align="center" mt={-2}>
                    <WarningIcon color="red" w={4} h={4} />
                    <Text color="red" fontSize="sm" mt={0.5} mb={0} ml={3} mr={3} textAlign="center">
                      Username or password is incorrect
                    </Text>
                  </Flex>
                }
                <FormControl id="password">
                  <FormLabel color="black">Password</FormLabel>
                  <Input bg="#D9DDE9" border={0} boxShadow={isLoginFailed ? "0 0 0 1px red" : "0 0 0 0"} _hover={{ bg: "#E2E8F0" }} sx={isLoginFailed ? { ":focus": { boxShadow: "0 0 0 1.5px red" } } : {}} color="black" type="password" borderRadius="15px" value={password} onChange={(e) => setPassword(e.target.value)} />
                </FormControl>
                <Link ml={3} color="black" mt={2} mb={0} fontSize="sm" onClick={openForgotPasswordModal} cursor="pointer">
                  Forgot password?
                </Link>
                <Stack spacing={10} align={'center'} justify={'center'}>
                  <Button bg="#E84C83" color="#F9F9FB" variant={'solid'} height="45px" width="300px" borderRadius="20px" mt={5} onClick={handleSubmit}>
                    Login
                  </Button>
                </Stack>
                <Link ml={3} color="black" mt={2} mb={4} fontSize="sm" cursor="pointer" onClick={handleRegisterRedirect}>
                  I don't have an account
                </Link>
              </Stack>
            </PressEnterAble>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal isOpen={isForgotPassword} onClose={closeForgotPasswordModal} size="lg" isCentered>
        <ModalOverlay  />
        <ModalContent backgroundColor={'#F9F9FB'} rounded={20} >
          <ModalBody>
            <Flex w="100%" h="230px" align={'center'} justify={'center'}>
              {isResetLinkSent ? (
                <Stack spacing={0} align={'center'} justify={'center'}>
                  <MdMarkEmailRead size={100} />
                  <Text fontSize={'3xl'}>Email sent!</Text>
                  <Text fontSize={17} mb={3}>Please check your email.</Text>
                </Stack>
              ) : (
                <Stack w="390px" p="37px" spacing={5} align={'center'} justify={'center'}>
                  <Text fontSize={'3xl'}>Forgot Your Password?</Text>
                  <FormControl id="email">
                    <FormLabel fontSize={13}>Get a reset link through your email</FormLabel>
                    <Input bg="#D9DDE9" border={0} _hover={{ bg: "#E2E8F0" }} color="black" type="email" borderRadius="15px" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </FormControl>
                  <Button bg="#E84C83" color="#FFFFFF" fontSize={13} variant={'solid'} h="35px" w="287px" mb="5px" borderRadius="20px" onClick={handleSendResetLink}>
                    Send Reset Link
                  </Button>
                </Stack>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}