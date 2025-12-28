import React, { useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import './LoadingScreen.css';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 7500); // 7.5 seconds loading time

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen">
      <DotLottieReact
        src="https://lottie.host/c00c5170-f0c1-4b21-9ef0-1549121484f1/FHDx3WlRYU.lottie"
        loop={false}
        autoplay
        className="loading-lottie"
      />
    </div>
  );
};

export default LoadingScreen;