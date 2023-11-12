import React from 'react';
import './App.css';
import { Box, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/auth-provider';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Navbar from './component/Navbar';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Box
          minH='100vh'
          sx={{
            background: 'linear-gradient(180deg, #000 0%, #2C2B64 54.69%, #504497 100%)'
          }}>
          <Router>
            <Routes>
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/*' element={
                <>
                  <Navbar/>
                  <Routes>
                    <Route path='/' element={<></>} />
                  </Routes>
                </>
              } />
            </Routes>
          </Router>
        </Box>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
