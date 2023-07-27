import { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { twMerge } from "tailwind-merge";

interface AnimateChangeProps {
  value: number | string;
  className?: string;
}

export function AnimateChange({ value, className = "" }: AnimateChangeProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  const color_spring = useSpring({
    color: isAnimating ? "#00BB83" : "black",
  });

  const bounce_spring = useSpring({
    transform: isAnimating ? "scale(1.3)" : "scale(1)",
    "-webkit-transform": isAnimating ? "scale(1.3)" : "scale(1)",
    "-o-transform": isAnimating ? "scale(1.3)" : "scale(1)",
    "-moz-transform": isAnimating ? "scale(1.3)" : "scale(1)",
  });

  useEffect(() => {
    if (value !== currentValue) {
      setIsAnimating(true);

      setTimeout(() => {
        setIsAnimating(false);
        setCurrentValue(value);
      }, 800);
    }
  }, [value, currentValue]);

  return (
    <animated.p
      style={{
        ...color_spring,
        ...bounce_spring,
      }}
      className={className}
    >
      {value}
    </animated.p>
  );
}
