
import React from 'react';
import YouTubeBackground from '../components/YouTubeBackground';
import HalalChecker from '../components/HalalChecker';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple/20 to-emerald/20">
      <YouTubeBackground />
      
      <div className="container mx-auto min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-emerald/30 mb-4 animate-glow">
            <span className="text-white text-sm font-medium">🌙 Halal Check</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Halal or Haram?
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Ask anything, get instant halal verdicts with that extra spice! 🌶️
          </p>
        </div>

        <HalalChecker />
      </div>
    </div>
  );
};

export default Index;
