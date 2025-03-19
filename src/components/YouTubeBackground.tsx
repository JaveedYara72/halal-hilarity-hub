
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
        videoId: 'qIQtvlZWvqo', // Keep the same video
        playerVars: {
          autoplay: 1,
          loop: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          iv_load_policy: 3, // Hide annotations
          modestbranding: 1, // Hide YouTube logo
          fs: 0, // Hide fullscreen button
          cc_load_policy: 0, // Hide closed captions
          disablekb: 1, // Disable keyboard controls
          mute: 1, // Muted for autoplay (browser requirement)
          playsinline: 1,
          playlist: 'qIQtvlZWvqo',
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
          },
          onStateChange: (event) => {
            // If video ends, restart it
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    // Add custom CSS to hide YouTube elements
    const style = document.createElement('style');
    style.textContent = `
      .ytp-chrome-top, .ytp-chrome-bottom, .ytp-watermark, .ytp-pause-overlay {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      // Remove the global callback when component unmounts
      window.onYouTubeIframeAPIReady = () => {};
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <div className="absolute inset-0 bg-black/30" /> {/* This is the main background overlay */}
      <div className="absolute inset-0 bg-black/24" /> {/* Added a second overlay with 24% opacity */}
      <div ref={playerRef} className="w-full h-full" />
    </div>
  );
};

export default YouTubeBackground;
