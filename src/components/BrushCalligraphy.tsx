import React from "react";

interface BrushCalligraphyProps {
  className?: string;
}

const BrushCalligraphy: React.FC<BrushCalligraphyProps> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 500 320"
      className={`w-full max-w-2xl mx-auto ${className}`}
      style={{ filter: "drop-shadow(0px 6px 12px rgba(0,0,0,0.15))" }}
    >
      <defs>
        {/* Dry brush texture with roughness */}
        <filter id="dryBrush">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" result="noise" seed="2" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
          <feComposite in="blur" in2="SourceGraphic" operator="lighten" />
        </filter>

        {/* Rough edges effect */}
        <filter id="roughEdges">
          <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" />
        </filter>
      </defs>

      {/* "Style" - First Line */}
      <g filter="url(#dryBrush)" fill="none" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round">
        {/* S - with varying stroke width */}
        <path d="M 45 85 Q 45 50 75 48 Q 105 48 105 68 Q 105 82 85 88 Q 65 94 70 108 Q 75 125 100 125 Q 125 125 130 105" strokeWidth="18" opacity="0.95" />

        {/* t */}
        <path d="M 155 38 L 155 115 Q 155 130 175 130 L 200 130" strokeWidth="16" opacity="0.92" />
        <line x1="130" y1="70" x2="185" y2="70" strokeWidth="16" opacity="0.92" />

        {/* y - expressive tail */}
        <path d="M 225 65 L 215 125 Q 210 145 190 155" strokeWidth="18" opacity="0.95" />
        <path d="M 250 65 Q 235 115 230 140" strokeWidth="18" opacity="0.95" />

        {/* l */}
        <path d="M 280 35 L 280 125" strokeWidth="18" opacity="0.95" />

        {/* e */}
        <path d="M 330 100 L 305 100 Q 305 65 330 65 Q 360 65 360 85 Q 360 110 310 110" strokeWidth="18" opacity="0.95" />
      </g>

      {/* "Gallery" - Second Line */}
      <g filter="url(#dryBrush)" fill="none" stroke="#1a1a1a" strokeLinecap="round" strokeLinejoin="round" transform="translate(0, 125)">
        {/* G - bold and expressive */}
        <path d="M 90 55 Q 65 55 45 75 Q 25 95 25 125 Q 25 155 50 175 Q 75 195 110 195 Q 135 195 155 180 L 155 140 L 85 140" strokeWidth="18" opacity="0.95" />

        {/* a */}
        <path d="M 195 115 Q 185 85 210 80 Q 235 78 250 95 L 250 125" strokeWidth="16" opacity="0.92" />
        <path d="M 180 125 L 250 125" strokeWidth="16" opacity="0.92" />

        {/* l */}
        <path d="M 285 50 L 285 125" strokeWidth="18" opacity="0.95" />

        {/* l */}
        <path d="M 320 50 L 320 125" strokeWidth="18" opacity="0.95" />

        {/* e */}
        <path d="M 375 105 L 345 105 Q 345 75 375 75 Q 405 75 405 95 Q 405 125 355 125" strokeWidth="18" opacity="0.95" />

        {/* r */}
        <path d="M 445 125 L 445 80 Q 445 70 465 70 Q 485 70 495 80" strokeWidth="16" opacity="0.92" />

        {/* y - expressive tail */}
        <path d="M 60 80 L 50 140 Q 45 160 25 170" strokeWidth="18" opacity="0.95" transform="translate(435, 0)" />
      </g>

      {/* Decorative accent strokes for fashion studio aesthetic */}
      <g stroke="#1a1a1a" strokeWidth="2" opacity="0.3">
        <path d="M 40 180 Q 60 175 80 180" fill="none" strokeLinecap="round" />
        <path d="M 420 180 Q 440 175 460 180" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export default BrushCalligraphy;
