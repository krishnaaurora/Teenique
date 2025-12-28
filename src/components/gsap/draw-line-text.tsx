import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface DrawLineTextProps {
  text: string;
  fontSize?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  onComplete?: () => void;
}

export const DrawLineText: React.FC<DrawLineTextProps> = ({
  text,
  fontSize = 60,
  strokeWidth = 1.5,
  color = 'var(--color-foreground)',
  className = '',
  onComplete,
}) => {
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    // Get the text path length
    const length = textElement.getComputedTextLength();

    // Set initial stroke-dasharray and stroke-dashoffset
    gsap.set(textElement, {
      strokeDasharray: length,
      strokeDashoffset: length,
      fill: 'transparent',
      stroke: color,
      strokeWidth: strokeWidth,
    });

    // Animate the stroke
    gsap.to(textElement, {
      strokeDashoffset: 0,
      duration: 2,
      ease: 'power2.out',
      onComplete: () => {
        // After stroke animation, fill the text
        gsap.to(textElement, {
          fill: color,
          stroke: 'transparent',
          duration: 0.5,
          onComplete,
        });
      },
    });
  }, [text, color, strokeWidth, onComplete]);

  return (
    <svg
      className={className}
      width="100%"
      height={fontSize * 1.2}
      viewBox={`0 0 ${text.length * fontSize * 0.6} ${fontSize * 1.2}`}
    >
      <text
        ref={textRef}
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontFamily="Helvetica, sans-serif"
        fontWeight="700"
      >
        {text}
      </text>
    </svg>
  );
};