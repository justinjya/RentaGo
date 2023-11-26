'use client'

import { useState, useEffect } from 'react'
import {
  Button,
  Heading,
  Text,
  Container,
  Flex,
  Box,
  VStack,
  HStack,
  Image,
  Spacer,
} from '@chakra-ui/react'
import { FaLocationDot } from "react-icons/fa6";
import { BsFillCalendar3WeekFill } from 'react-icons/bs' 
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { StarRating } from '../components/StarRating'
import { useNavigate } from 'react-router-dom';
import { getUserHistory, submitRating } from '../services/historyService'
import { useSupabase } from '../services/supabaseService'
import { useAuth } from '../services/authContext'
import { useDetails } from '../services/detailsContext'

export default function History() {
  const supabase = useSupabase();
  const { username } = useAuth();
  const { rental } = useDetails();
  const navigate = useNavigate();

  const [userHistory, setUserHistory] = useState<any[]>([]);
  useEffect(() => {
    if (rental) {
      navigate("/pay");
    }

    async function fetchUserHistory() {
      const data = await getUserHistory(supabase, username);
      setUserHistory(data);
    }
  
    fetchUserHistory();
  });

  const [ratings, setRatings] = useState<Record<number, number>>({});
  const handleRatingChange = (rating: number, item:any) => {
    setRatings(prevRatings => ({ ...prevRatings, [item.rent_id]: rating }));
  };

  const handleSubmit = async (item: any, rating: number) => {
    if (item.status === "Failed") {
      return;
    }
  
    const rent_id = item.rent_id;
    const isRatingSuccess = await submitRating(supabase, rent_id, rating);
    if (isRatingSuccess) {
      setRatings(prevRatings => ({ ...prevRatings, [item.rent_id]: 0 }));
    }
  };

  const [page, setPage] = useState(1);
  const pageSize = 5;

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'start'}
      direction={'column'}>
      <Heading
        as={'h1'}
        fontSize={{ base: '2xl', sm: '3xl' }}
        textAlign={'center'}
        mr={900}
        mb={5}
        mt={5}
        color="#F9F9FB">
          History
      </Heading>
      {userHistory && userHistory
      .slice((page - 1) * pageSize, page * pageSize)
      .map((item, index) => (
      <Container
        maxW="1000px"
        height="160px"
        bg={"#F9F9FB"}
        boxShadow={'xl'}
        rounded={'20px'}
        p={6}
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={5}
        key={index}>
        <Flex direction='row'>
          <Image
            src={item.image}
            alt={item.name}
            mr={5}
            w={200}
            h={130}
            objectFit={'cover'}
          />
          <VStack align="start" justify="start" spacing={1}>
            <Flex direction={'row'} justify={'space-between'}>  
              <Box borderRight="1px solid black" pr={10} mr={2} alignItems="start" mt={4} minW="542px">
                <HStack align={'start'}>
                  <Text
                    fontSize={28}
                    mt={-1.5}
                  >
                    {item.name}
                  </Text>
                  <Spacer w={300}/>
                  <Text fontSize={21}>
                    Rp {item.amount.toLocaleString('id-ID')}
                  </Text>
                </HStack>
                <Text fontSize={13} mt={-1}>
                  {item.brand}
                </Text>
                <HStack justifyContent="flex-end" mt={-2}>
                  <FaLocationDot size={19}/>
                  <Text fontSize={13}>
                    {item.location}
                  </Text>
                </HStack>
                <HStack>             
                  <StatusBox status={item.status}/>
                  <Spacer w={70}/>
                  <HStack mt={2}>
                    <BsFillCalendar3WeekFill size={19}/> 
                    <Text fontSize={13}>
                      {item.pick_up_date} - {item.drop_off_date}
                    </Text>
                  </HStack>
                </HStack>
              </Box>
              <Flex justifyContent="center" alignItems="center" w="100%" ml={6}>
                <VStack mt={3}>
                  <StarRating size="23" spacing="3" onRatingChange={(rating) => handleRatingChange(rating, item)}  value={item.rating} item={item}/>
                  <Button 
                    isDisabled={item.status !== "Success" || (ratings[item.rent_id] || 0) === 0}
                    fontSize="12px"
                    bg="#E84D83" 
                    color="#F9F9FB" 
                    borderRadius="20px" 
                    mt={2} 
                    width="127px" 
                    height="32px" 
                    onClick={() => handleSubmit(item, ratings[item.rent_id] || 0)}
                    _hover={{ bg: "#E84D83" }}>
                    Submit
                  </Button>
                </VStack>
              </Flex>
            </Flex>
          </VStack>
        </Flex> 
      </Container>))}
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

          {Array.from({ length: Math.ceil(userHistory.length / pageSize) }, (_, i) => i + 1).map((pageNum) => (
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
            isDisabled={page === Math.ceil(userHistory.length / pageSize)}
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

const StatusBox = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "rgba(0, 128, 0, 0.70)";
      case "Pending":
        return "rgba(255, 192, 29, 0.70)";
      case "Failed":
        return "rgba(181, 15, 15, 0.70)";
      default:
        return "rgba(255, 192, 29, 0.70)";
    }
  }

  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" w="58px" h="22px" bg={getStatusColor(status)} rounded={20}>
        <Text fontSize={11} color={"#F9F9FB"}>
          {status}
        </Text>
      </Box>
    </>
  )
}