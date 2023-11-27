'use client'

import { useState, useEffect } from 'react'
import {
  Text,
  Container,
  Flex,
  VStack,
  HStack,
  Image,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { getUserDetails } from '../services/profileService'
import { useSupabase } from '../services/supabaseService'
import { useAuth } from '../services/authContext'
import { useDetails } from '../services/detailsContext'

export default function ProfilePage() {
    const supabase = useSupabase()
    const navigate = useNavigate()
    const { username } = useAuth()
    const { rental } = useDetails()
    const [email, setEmail] = useState(null)

    useEffect (() => {
        if (rental) {
            navigate("/pay");
        }

        const fetchUserDetails = async () => {
            if (username) {
                const data = await getUserDetails(supabase, username)
                
                if (data) {
                    setEmail(data[0].email)
                }
            }
            return
        }

        fetchUserDetails()
    })

    return (
        <Flex justify={"center"} alignItems={"start"}>
            <VStack align="start">
                <Text
                    fontSize={'4xl'}
                    fontWeight={'normal'}
                    mb={5}
                    mt={5}
                    color="#F9F9FB">
                    Profile
                </Text>
                <HStack align={"start"} spacing={14}>
                        <Image
                            src="https://via.placeholder.com/150"
                            alt="Your alt text"
                            boxSize="250px"
                            />
                    <Container
                        w="600px"
                        h="300px"
                        maxW="none"
                        bg={"#F9F9FB"}
                        boxShadow={'xl'}
                        rounded={'20px'}
                        p={6}
                        display="flex"
                        justifyContent="start"
                        alignItems="start"
                        mb={5}
                    >
                        <VStack align={"start"} spacing={8}>
                            <VStack align={"start"} spacing={1}>
                                <Text fontSize={"18px"}>Username</Text>
                                <Text fontSize={"18px"}>{username}</Text>
                            </VStack>
                            <VStack align={"start"} spacing={1}>
                                <Text fontSize={"18px"}>Email</Text>
                                <Text fontSize={"18px"}>{email}</Text>
                            </VStack>

                        </VStack>
                    </Container>
                </HStack>
            </VStack>
        </Flex>
    )
}