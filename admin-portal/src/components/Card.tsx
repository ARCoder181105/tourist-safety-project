import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// Motion wrapper for hover animation
const MotionDiv = motion.div;

export const Card = ({ className, children, ...props }: CardProps) => (
  <MotionDiv
    whileHover={{ y: -3, boxShadow: "0px 15px 25px rgba(0,0,0,0.15)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={twMerge(
      "rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300",
      className
    )}
    {...props}
  >
    {children}
  </MotionDiv>
);

export const CardHeader = ({ className, children, ...props }: CardProps) => (
  <div className={twMerge("flex flex-col space-y-2 p-6 border-b border-gray-100", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: CardProps) => (
  <h3
    className={twMerge(
      "text-2xl font-bold text-gray-900 tracking-tight leading-snug",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }: CardProps) => (
  <p
    className={twMerge(
      "text-gray-500 text-sm leading-relaxed",
      className
    )}
    {...props}
  >
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }: CardProps) => (
  <div className={twMerge("p-6 pt-4", className)} {...props}>
    {children}
  </div>
);
