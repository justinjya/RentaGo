import { HStack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";

type StarProps = {
    filled: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    size: string | number;
};

type GradientStarProps = {
    size: string | number;
};  

type SolidStarProps = {
  size: string | number;
  color: string;
};

const SolidStar = ({ size, color }: SolidStarProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={color} width={size} height={size}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const GradientStar = ({ size }: GradientStarProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="url(#grad1)" width={size} height={size}>
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{stopColor:"#504497", stopOpacity:1}} />
        <stop offset="50%" style={{stopColor:"#E84C83", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#504497", stopOpacity:1}} />
      </linearGradient>
    </defs>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const Star = ({ filled, onClick, onMouseEnter, size }: StarProps) => {
    return (
        <span onClick={onClick} onMouseEnter={onMouseEnter}>
          {filled ? <GradientStar size={size} /> : <SolidStar size={size} color="#D9DDE9" />}
        </span>
    );
};

type StarRatingProps = {
  size?: string | number;
  spacing?: string | number;
  number?: number;
  value?: number;
  onRatingChange?: (rating: number) => void;
  item?: any | null;
};

export const StarRating = ({ size = "1em", spacing = "1", number = 5, value = 0, onRatingChange, item = null }: StarRatingProps) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(-1);
  const [justCancelled, setJustCancelled] = useState(-1);

  useEffect(() => {
    setRating(value);
  }, [value]);

  const handleStarClick = (index: number) => {
    if (item !== null) {
      if ((item.status !== "Success" && item.status !== null) || (item.status === "Success" && item.rating !== 0)) {
        return;
      }
    }

    const newRating = index + 1 === rating ? 0 : index + 1;
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
      setJustCancelled(-1)
    }
    if (index === rating - 1) {
      setRating(0)
      setJustCancelled(index)
    }
  };
  return (
    item !== null ? (
    <HStack
      spacing={spacing}
      onMouseLeave={() => item.status === 'Success' && setHovered(-1)}
    >
      {[...Array(number)].map((_, index) => (
        <Star
          key={index}
          filled={(index < rating || (index <= hovered && rating === 0 && justCancelled !== index)) && justCancelled === -1}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => { if (rating === 0 && item.status === 'Success' && index !== justCancelled) {setHovered(index); setJustCancelled(-1)} }}
          size={size}
        />
      ))}
    </HStack>
    ) : (
      <HStack
        spacing={spacing}
        onMouseLeave={() => {setHovered(-1); setJustCancelled(-1)}}
      >
        {[...Array(number)].map((_, index) => (
          <Star
            key={index}
            filled={(index < rating || (index <= hovered && rating === 0 && justCancelled !== index)) && justCancelled === -1}
            onClick={() => handleStarClick(index)}
            onMouseEnter={() => { if (rating === 0 && index !== justCancelled) {setHovered(index); setJustCancelled(-1)} }}
            size={size}
          />
        ))}
      </HStack>
    )
  );
};