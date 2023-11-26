import React, { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import { useAuth } from "../services/authContext";

type BackgroundBlurProps = {
    children: ReactNode;
};

export const BackgroundBlur = ({ children }: BackgroundBlurProps) => {
    const { showLoginPage, showRegisterPage } = useAuth();

    return (
        <Box 
            position="absolute"
            w="100%" 
            h="100vh"
            zIndex={(showLoginPage || showRegisterPage) ? "700" : "0"} 
            transition="backdropFilter 0.2s ease-in-out, opacity 0.2s ease-in-out"
            backdropFilter={(showLoginPage || showRegisterPage) ? 'blur(20px)' : 'blur(0px)'}
            opacity={(showLoginPage || showRegisterPage) ? 1 : 0}
            bg="rgba(0, 0, 0, 0.3)"
        >
            {children}
        </Box>
    )
}