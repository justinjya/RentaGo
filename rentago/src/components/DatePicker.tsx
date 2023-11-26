'use client'

import {
  Text,
	Box, 
	VStack,
	HStack,
	IconButton,
	Spacer,
} from '@chakra-ui/react'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { 
	addMonths, 
	subMonths, 
	format, 
} from 'date-fns';

import { Calendar } from './Calendar';

interface DatePickerProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  nextMonth: Date;
  setNextMonth: (date: Date) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

export const DatePicker = ({
  currentMonth,
  setCurrentMonth,
  nextMonth,
  setNextMonth,
  startDate,
  setStartDate,
  endDate,
  setEndDate
}: DatePickerProps) => {
  return (
    <Box w="596px">
      <VStack spacing={4}>
        <Box display="flex" justifyContent="space-between" gap={3}>
          <Box w="278px">
            <HStack justifyContent="center">
              <IconButton 
                aria-label="Previous month"
                icon={<ChevronLeftIcon />}
                bg="transparent"
                onClick={() => {
                  setCurrentMonth(subMonths(currentMonth, 1))
                  setNextMonth(subMonths(nextMonth, 1))
                }} />
              <Spacer />
              <Text fontSize={'13'}>{format(currentMonth, 'MMMM yyyy')}</Text>
              <Spacer flex={2} />
            </HStack>
            <Calendar month={currentMonth} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
          </Box>
          <Box w="278px">
            <HStack justifyContent="center">
              <Spacer flex={2} />
              <Text fontSize={'13'}>{format(nextMonth, 'MMMM yyyy')}</Text>
              <Spacer />
              <IconButton 
                aria-label="Next month"
                icon={<ChevronRightIcon />}
                bg="transparent"
                onClick={() => {
                  setCurrentMonth(addMonths(currentMonth, 1))
                  setNextMonth(addMonths(nextMonth, 1))
                }}>
                  Next
              </IconButton>
            </HStack>
            <Calendar month={nextMonth} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
          </Box>
        </Box>
      </VStack>
    </Box>
  )
}