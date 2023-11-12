'use client'

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Stack,
  Link,
} from '@chakra-ui/react'
import React, { useState, useContext } from 'react'
import { AuthContext } from '../services/auth-provider'

export default function Navbar() {
  const { isLoggedIn, handleLogout, username } = useContext(AuthContext)
  
  return (
    <>
      <Box 
        sx={{
          background: 'linear-gradient(0deg, rgba(57, 57, 57, 0.20) 0%, rgba(57, 57, 57, 0.20) 100%), linear-gradient(180deg, #000 0%, #2C2B64 636.18%, #504497 1163.3%)',
          backdropFilter: 'blur(10px)'
        }}
        px={66}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Link 
            href='/'
            _hover={{textDecoration: 'none'}}>
            <Text
              fontSize='2xl'
              variant='unstyled'
              cursor={'pointer'}
              color={'#F9F9FB'}
              _hover={{transform: 'scale(1.02)'}}>
              RentaGo
            </Text>
          </Link>

          <Flex alignItems={'center'}>
            {!isLoggedIn && (
              <Stack direction={'row'} spacing={5}>
                <Button
                  as={'a'} 
                  href={'register'}
                  fontSize={'md'} 
                  fontWeight={400} 
                  color={'#F9F9FB'}
                  variant={'link'}
                  _hover={{transform: 'scale(1.1)'}}>
                    Register
                </Button>
                <Button
                  as={'a'} 
                  href={'login'}
                  fontSize={'md'} 
                  fontWeight={400} 
                  color={'#F9F9FB'}
                  variant={'link'} 
                  mr={9}
                  _hover={{transform: 'scale(1.1)'}}>
                    Login
                </Button>
              </Stack>
            )}
            {isLoggedIn && (
              <Stack direction={'row'} spacing={7}>
                <Menu offset={[0, 14]}>
                  <BottomOutlineMenuButton>
                    <Flex alignItems={'center'}>
                      <Text mr={4} fontWeight='normal' color={'#F9F9FB'}>{username}</Text>
                      <Avatar
                        size={'sm'}
                        bg="grey"
                      />
                    </Flex>
                  </BottomOutlineMenuButton>
                  <MenuList 
                    alignItems={'center'} 
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropBlur: '10px'
                    }}>
                    <Link href='profile' _hover={{textDecoration: 'none'}}>
                      <TransparentMenuItem>Profile</TransparentMenuItem>
                    </Link>
                    <Link href='history' _hover={{textDecoration: 'none'}}>
                      <TransparentMenuItem>History</TransparentMenuItem>
                    </Link>
                    <MenuDivider></MenuDivider>
                    <Link _hover={{textDecoration: 'none'}} onClick={handleLogout}>
                      <TransparentMenuItem>Logout</TransparentMenuItem>
                    </Link>
                  </MenuList>
                </Menu>
              </Stack>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  )
}

const TransparentMenuItem = ({ ...props }) => (
  <MenuItem
    color='#F9F9FB' 
    sx={{ 
      bg: 'rgba(255, 255, 255, 0)', 
      _hover: { bg: 'rgba(255, 255, 255, 0.1)' }
    }} 
    {...props} 
  />
)

const BottomOutlineMenuButton = ({ ...props }) => (
  <MenuButton
    as={Button}
    h={16}
    rounded={'none'}
    variant={'solid'}
    cursor={'pointer'}
    minW={0}
    bg='rgba(255, 255, 255, 0)'
    sx={{
      position: 'relative',
      '::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '1px',
        backgroundColor: 'transparent',
        transition: 'backgroundColor 0.2s',
      },
    }}
    _hover={{
      '::after': {
        backgroundColor: 'white',
      },
    }}
    _active={{
      '::after': {
        backgroundColor: 'white',
      },
    }}>
    {props.children}
  </MenuButton>
)
