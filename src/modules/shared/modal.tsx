import { ReactNode } from "react";
import { animated, useSpring } from "react-spring";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({ children, isOpen, onClose }: ModalProps) {
  const slideSpring = useSpring({
    from: { transform: "translateY(100%)" },
    to: { transform: "translateY(0%)" },
    config: { duration: 200 },
  });

  if (!isOpen) return null;

  return (
    <div className="z-50 fixed inset-0">
      <div
        className="bg-gray-800/60 w-full h-full flex flex-col justify-end"
        onClick={(e) => {
          e.stopPropagation();

          if (e.target !== e.currentTarget) return;

          onClose();
        }}
      >
        <animated.div style={slideSpring} className="bg-white rounded-t-[16px]">
          {children}
        </animated.div>
      </div>
    </div>
  );
}
