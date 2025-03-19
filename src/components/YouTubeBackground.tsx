
import React, { useEffect, useRef } from 'react';

const YouTubeBackground = () => {
  const playerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the IFrame Player API code asynchronously
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Create YouTube player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player(playerRef.current!, {
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
          origin: window.location.origin,
          enablejsapi: 1,
          widget_referrer: window.location.href
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            
            // Hide the iframe border and make it cover the entire container
            if (playerRef.current) {
              const iframe = playerRef.current.querySelector('iframe');
              if (iframe) {
                iframe.style.border = 'none';
                iframe.style.width = '100vw';
                iframe.style.height = '100vh';
                iframe.style.position = 'absolute';
                iframe.style.top = '50%';
                iframe.style.left = '50%';
                iframe.style.transform = 'translate(-50%, -50%)';
                iframe.style.pointerEvents = 'none';
              }
            }
          },
          onStateChange: (event) => {
            // If video ends, restart it
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
            // If video is paused for some reason, play it
            if (event.data === window.YT.PlayerState.PAUSED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    // Add custom CSS to hide YouTube elements
    const style = document.createElement('style');
    style.textContent = `
      .ytp-chrome-top, 
      .ytp-chrome-bottom, 
      .ytp-watermark, 
      .ytp-pause-overlay,
      .ytp-youtube-button,
      .ytp-embed,
      .ytp-large-play-button,
      .ytp-title,
      .ytp-share-button,
      .ytp-watch-later-button,
      iframe[src*="youtube.com"] .ytp-impression-link,
      .ytp-menuitem-label {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
      
      iframe[src*="youtube.com"] {
        border: none !important;
      }
      
      .background-player-container {
        overflow: hidden;
        position: absolute;
        width: 300%;
        height: 300%;
        top: -100%;
        left: -100%;
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
      <div ref={containerRef} className="background-player-container">
        <div ref={playerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default YouTubeBackground;
