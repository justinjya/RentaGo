import { Button } from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { MouseEventHandler } from 'react';

interface BackButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
  }

export default function BackButton({ onClick }: BackButtonProps) {
    return (
        <Button
            onClick={onClick}
            leftIcon={<ChevronLeftIcon
            boxSize="34px"/>}
            iconSpacing="0rem"
            color="#F9F9FB"
            bg="transparent"
            _hover={{ 
                bg: "transparent",
                transform: "scale(1.1)"
            }}>
            Back
        </Button>
    )
}