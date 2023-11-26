import './App.css';
import { useEffect } from 'react'
import { Box, ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './services/authContext';
import { DetailsProvider } from './services/detailsContext';
import { BackgroundBlur } from './components/BackgroundBlur';
import { useSupabase } from './services/supabaseService';
import { checkPaymentDue } from './services/payService';
import Navbar from './components/Navbar';
import LandingPage from './pages/Landing';
import Catalog from './pages/Catalogue';
import Rental from './pages/Rental';
import Payment from './pages/Payment';
import History from './pages/History';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';

function App() {
  const supabase = useSupabase()

  useEffect (() => {
    const updatePaymentStatus = async () => {
      const ONE_SECOND = 1000
      
      const interval = setInterval(async () => {
        await checkPaymentDue(supabase)
      }, ONE_SECOND * 15)

      return () => clearInterval(interval)
    }

    updatePaymentStatus()
  })
  
  return (
    <ChakraProvider>
      <AuthProvider>
        <DetailsProvider>
          <Router>
            <Box
              minH='100vh'
              sx={{
                background: 'linear-gradient(180deg, #000 0%, #2C2B64 54.69%, #504497 100%)'
              }}
            >
              <Box position="absolute" w="100%" zIndex="9999">
                <Navbar />
              </Box>
                <BackgroundBlur>
                  <Box 
                    position="absolute"
                    w="100%" 
                    zIndex="9998" 
                  >
                    <LoginPage />
                    <RegisterPage />
                  </Box>
                </BackgroundBlur>
              <Box position="relative">
              <Box h="64px" />
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/catalogue" element={<Catalog />} />
                  <Route path="/rent" element={<Rental />} />
                  <Route path="/pay" element={<Payment />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </Box>
            </Box>
          </Router>
        </DetailsProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
