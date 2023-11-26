import {
    Text,
    Box, 
    VStack,
    Center,
  } from '@chakra-ui/react'
  import { 
	format, 
	startOfMonth, 
	endOfMonth, 
    startOfWeek,
    endOfWeek,
	eachDayOfInterval, 
	isSameMonth, 
	isSameDay,
	isWithinInterval,
	isBefore,
	startOfDay,
} from 'date-fns';

interface CalendarProps {
    month: Date;
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
}

export const Calendar = ({ month, startDate, endDate, setStartDate, setEndDate }: CalendarProps) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysOfMonth = eachDayOfInterval({
        start: startOfWeek(startOfMonth(month)),
        end: endOfWeek(endOfMonth(month)),
    });
  
    return (
        <VStack spacing={1} w="268px">
            <Box borderRadius={20} display="flex" flexWrap="wrap" justifyContent="start" w="100%">
                {daysOfWeek.map((day, index) => (
                    <Box fontSize={'8'} borderRadius={20} key={index} width="14.28%" p={1}>
                        <Center h="100%">
                            <Text fontWeight="normal" textTransform="uppercase">{day}</Text>
                        </Center>
                    </Box>
                ))}
            </Box>
            <Box borderRadius={20} display="flex" flexWrap="wrap" justifyContent="start" mb={2}>
                {daysOfMonth.map((day, index) => (
                    <Box fontSize={'11'} borderRadius={20} key={index} width="14.28%" p={1.5}>
                        <Center borderRadius={20} h="100%" bg={getBackgroundColor(day, startDate, endDate)} color={getTextColor(day, startDate, endDate, month)} onClick={() => handleDateClick(day, startDate, setStartDate, endDate, setEndDate, month)} cursor={"pointer"}>
                            {format(day, 'd')}
                        </Center>
                    </Box>
                ))}
            </Box>
        </VStack>
    );
};

function getBackgroundColor(day: Date, startDate: Date | null, endDate: Date | null) {
	if ((startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate))) {
		return "#504497";
	} 
	else if (startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate })) {
		return '#50449740';
	}
    else {
        return "#D9DDE9"
    }
}

function getTextColor(day: Date, startDate: Date | null, endDate: Date | null, currentMonth: Date) {
	if (isBefore(day, startOfDay(new Date()))) {
        return '#00000040';
    }
	
	if ((startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate))) {
		return '#D9DDE9';
	} 
	else if (startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate })) {
		return 'black';
	} 
	else if (isSameMonth(day, currentMonth)) {
		return 'black';
	} 
	else {
		return '#00000040';
	}
}

function handleDateClick(day: Date, startDate: Date | null, setStartDate: (date: Date | null) => void, endDate: Date | null, setEndDate: (date: Date | null) => void, currentMonth: Date) {
    if (isSameMonth(day, currentMonth) && !isBefore(day, startOfDay(new Date()))) {
        if (startDate && !endDate && isBefore(day, startDate)) {
            setStartDate(day);
            setEndDate(startDate);
        } 
        else if (!startDate) {
            setStartDate(day);
        } 
        else if (startDate && !endDate) {
            setEndDate(day);
        } 
        else {
            setStartDate(day);
            setEndDate(null);
        }
    }
}