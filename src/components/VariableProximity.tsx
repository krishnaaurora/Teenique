"use client";

import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useAnimationFrame } from "motion/react";
import "./VariableProximity.css";

interface VariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: React.RefObject<HTMLElement>;
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
  className?: string;
}

export interface VariableProximityRef {
  element: HTMLSpanElement | null;
}

const VariableProximity = forwardRef<VariableProximityRef, VariableProximityProps>(
  (
    {
      label,
      fromFontVariationSettings,
      toFontVariationSettings,
      containerRef,
      radius = 50,
      falloff = "linear",
      className = "",
    },
    ref
  ) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const mousePos = useRef({ x: 0, y: 0 });
    const isInContainer = useRef(false);

    useImperativeHandle(ref, () => ({
      element: spanRef.current,
    }));

    const parseFontVariationSettings = (settings: string) => {
      const result: Record<string, number> = {};
      const regex = /'([^']+)'\s+([\d.]+)/g;
      let match;
      while ((match = regex.exec(settings)) !== null) {
        result[match[1]] = parseFloat(match[2]);
      }
      return result;
    };

    const calculateFalloff = (
      distance: number,
      radius: number,
      falloffType: "linear" | "exponential" | "gaussian"
    ) => {
      const normalized = Math.min(distance / radius, 1);
      switch (falloffType) {
        case "exponential":
          return Math.pow(1 - normalized, 2);
        case "gaussian":
          return Math.exp(-Math.pow(normalized * 2, 2) / 2);
        case "linear":
        default:
          return 1 - normalized;
      }
    };

    const interpolateSettings = (
      from: Record<string, number>,
      to: Record<string, number>,
      t: number
    ) => {
      const result: string[] = [];
      for (const key in from) {
        if (to.hasOwnProperty(key)) {
          const interpolatedValue = from[key] + (to[key] - from[key]) * t;
          result.push(`'${key}' ${interpolatedValue}`);
        }
      }
      return result.join(", ");
    };

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleMouseMove = (e: MouseEvent) => {
        mousePos.current = { x: e.clientX, y: e.clientY };
      };
      const handleMouseEnter = () => {
        isInContainer.current = true;
      };
      const handleMouseLeave = () => {
        isInContainer.current = false;
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, [containerRef]);

    const fromSettings = parseFontVariationSettings(fromFontVariationSettings);
    const toSettings = parseFontVariationSettings(toFontVariationSettings);

    useAnimationFrame(() => {
      if (!spanRef.current) return;

      charRefs.current.forEach((charSpan) => {
        if (!charSpan) return;

        const rect = charSpan.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        if (!isInContainer.current) {
          charSpan.style.fontVariationSettings = fromFontVariationSettings;
          return;
        }

        const distance = Math.sqrt(
          Math.pow(charCenterX - mousePos.current.x, 2) +
            Math.pow(charCenterY - mousePos.current.y, 2)
        );

        const falloffValue = calculateFalloff(distance, radius, falloff);
        const interpolatedSettings = interpolateSettings(
          fromSettings,
          toSettings,
          falloffValue
        );

        charSpan.style.fontVariationSettings = interpolatedSettings;
      });
    });

    return (
      <span
        ref={spanRef}
        className={`variable-proximity-container ${className}`}
      >
        {label.split("").map((char, index) => (
          <span
            key={index}
            ref={(el) => {
              charRefs.current[index] = el;
            }}
            style={{ fontVariationSettings: fromFontVariationSettings }}
          >
            {char}
          </span>
        ))}
      </span>
    );
  }
);

VariableProximity.displayName = "VariableProximity";

export default VariableProximity;
