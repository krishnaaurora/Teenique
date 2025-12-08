import React from "react";

interface AnimatedTextProps {
  text: string;
  splitType?: "chars" | "words";
  staggerDelay?: number;
  duration?: number;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  splitType = "words",
  staggerDelay = 0.1,
  duration = 0.6,
  className = "",
}) => {
  // Split text into segments
  const segments = splitType === "chars" ? text.split("") : text.split(" ");

  return (
    <style key="animated-text-styles">
      {`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }

        .animated-segment {
          display: inline-block;
          ${splitType === "chars" ? "" : "margin-right: 0.25em;"}
          animation: fadeInUp ${duration}s ease-out forwards;
        }
      `}
    </style>
  );
};

export default AnimatedText;

// Render function to be used in JSX
export const renderAnimatedText = (
  text: string,
  splitType: "chars" | "words" = "words",
  staggerDelay: number = 0.1,
  duration: number = 0.6,
  className: string = ""
) => {
  const segments = splitType === "chars" ? text.split("") : text.split(" ");

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }

        .animated-segment {
          display: inline-block;
          ${splitType === "chars" ? "" : "margin-right: 0.25em;"}
          animation: fadeInUp ${duration}s ease-out forwards;
        }
      `}</style>
      <span className={className}>
        {segments.map((segment, index) => (
          <span
            key={index}
            className="animated-segment"
            style={{
              animationDelay: `${index * staggerDelay}s`,
            }}
          >
            {splitType === "chars" ? segment : segment}
            {splitType === "words" && index < segments.length - 1 && " "}
          </span>
        ))}
      </span>
    </>
  );
};
