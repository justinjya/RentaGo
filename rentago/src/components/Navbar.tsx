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
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../services/authContext'
import { useDetails } from '../services/detailsContext'
import { useSupabase } from '../services/supabaseService';
import { signOut } from '../services/signOutService';

export default function NavBar() { 
  const supabase = useSupabase()
  const { isLoggedIn, username, logout, showLoginPage, setShowLoginPage, showRegisterPage, setShowRegisterPage } = useAuth()
  const { resetDetails } = useDetails()

  const navigate = useNavigate()
  const location = useLocation()
  const currentLocation = location.pathname
  
  const handleLogoClick = () => {
    if (currentLocation === '/pay') {
      return
    }
    resetDetails()
    navigate('/')
  }
  const handleProfileClick = () => {
    navigate('/profile')
  }
  const handleHistoryClick = () => {
    navigate('/history')
  }
  const handleLogoutClick = () => {
    if (currentLocation === '/pay') {
      return
    }

    signOut(supabase)
    logout()
    resetDetails()
    navigate('/')
  }

  return (
    <Box 
      sx={{
        background: 'linear-gradient(0deg, rgba(57, 57, 57, 0.20) 0%, rgba(57, 57, 57, 0.20) 100%), linear-gradient(180deg, #000 0%, #2C2B64 636.18%, #504497 1163.3%)',
        backdropFilter: 'blur(10px)'
      }}
      px={66}>
      <Flex h="64px" alignItems={'center'} justifyContent={'space-between'}>
        <Button 
          fontSize='2xl'
          fontWeight={'normal'}
          color={'#F9F9FB'}
          variant='link'
          opacity={currentLocation === '/pay' ? '0.5' : '1'}
          onClick={() => {
            handleLogoClick()
          }}
          _hover={{
            textDecoration: 'none',
            transform: currentLocation === '/pay' ? '' : 'scale(1.1)'}}>
            RentaGo
        </Button>
        <Flex alignItems={'center'}>
          {!isLoggedIn && (
            <Stack direction={'row'} spacing={5}>
              <Button
                fontSize={'md'} 
                fontWeight={400} 
                color={'#F9F9FB'}
                variant={'link'} 
                onClick={() => {
                  if (showLoginPage) {
                    setShowLoginPage(false);
                  }
                  setShowRegisterPage(true)}}
                _hover={{transform: 'scale(1.1)'}}>
                  Register
              </Button>
              <Button
                fontSize={'md'} 
                fontWeight={400} 
                color={'#F9F9FB'}
                variant={'link'} 
                onClick={() => {
                  if (showRegisterPage) {
                    setShowRegisterPage(false)
                  }
                  setShowLoginPage(true)}}
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
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </Flex>
                </BottomOutlineMenuButton>
                <MenuList 
                  alignItems={'center'} 
                  sx={{
                    background: 'rgba(0, 0, 0, 0.95)',
                    backdropBlur: '10px'
                  }}>
                  <Link _hover={{textDecoration: 'none'}} onClick={handleProfileClick}>
                    <TransparentMenuItem>Profile</TransparentMenuItem>
                  </Link>
                  <Link _hover={{textDecoration: 'none'}} onClick={handleHistoryClick}>
                    <TransparentMenuItem>History</TransparentMenuItem>
                  </Link>
                  <MenuDivider></MenuDivider>
                  <Link _hover={{textDecoration: 'none'}}>
                    {currentLocation === '/pay' ? (
                      <DisabledTransparentMenuItem onClick={handleLogoutClick}>
                        Logout
                      </DisabledTransparentMenuItem>
                    ) : (
                      <TransparentMenuItem onClick={handleLogoutClick}>
                        Logout
                      </TransparentMenuItem>
                    )}
                  </Link>
                </MenuList>
              </Menu>
            </Stack>
          )}
        </Flex>
      </Flex>
    </Box>
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

const DisabledTransparentMenuItem = ({ ...props }) => (
  <MenuItem
    color='#F9F9FB' 
    sx={{ 
      bg: 'rgba(255, 255, 255, 0)'
    }} 
    isDisabled
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