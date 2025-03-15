
import React, { useEffect, useRef } from 'react';

const YouTubeBackground = () => {
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Create YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(playerRef.current!, {
        videoId: 'qIQtvlZWvqo',
        playerVars: {
          autoplay: 1,
          loop: 1,
          controls: 0,
          showinfo: 0,
          mute: 0,
          playsinline: 1,
          playlist: 'qIQtvlZWvqo'
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          }
        }
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-black/30" />
      <div ref={playerRef} className="w-full h-full" />
    </div>
  );
};

export default YouTubeBackground;
