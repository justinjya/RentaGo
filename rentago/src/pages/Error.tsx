
import React from 'react';
import {Text, Flex, VStack, Button, Image, Box} from '@chakra-ui/react'
import crashImage from '../assets/crash.svg'
import { useNavigate } from 'react-router-dom';


const Error: React.FC = () => {
    const navigate = useNavigate();
    const navigateToLanding = () => {
        navigate('/')
    }
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
    <Flex direction="row" justifyContent="space-between" h="100vh" overflowY="hidden">
    <Flex>
        <VStack pl="70px" >
            <Text fontSize="200px" textColor="transparent" mb="-80px" css={{ WebkitTextStroke: '5px #F9F9FB' }}>404</Text>
            <Text fontSize="35px" textColor="#F9F9FB" >Page Not Found</Text>
            <Button w="270px" h="45px" bg="#E84C83" borderRadius={20} textColor="#FFFFFF" mt={5} _hover={{}} _active={{}} onClick={navigateToLanding}>
                Back to Home
            </Button>
            
        </VStack>
    </Flex>
    <Flex justifyContent="flex-end" alignItems="flex-end"  w="100%" h="87%" align="end">
        <Image
                src={crashImage}
                width={"85%"}
                height={"80%"}
                position="relative"
                top="30px"
            />
    </Flex>
    </Flex>
    </Box>
    </div>
  );
};

export default Error;
