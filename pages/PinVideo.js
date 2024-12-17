"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";


// https://codepen.io/wisearts/pen/ExZGrbZ


gsap.registerPlugin(ScrollTrigger);

const PinVideo = () => {
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const videoElement = videoRef.current;
      const containerElement = videoContainerRef.current;

      let frameNumber = 0;

      // Ensure video plays smoothly on iOS
      const activateVideo = () => {
        videoElement.play();
        videoElement.pause();
      };

      const preloadVideo = () => {
        gsap.to(videoElement, {
          currentTime: videoElement.duration - 0.1,
          duration: 1,
          paused: true,
        });
      };

      videoElement.addEventListener("loadedmetadata", preloadVideo);
      document.documentElement.addEventListener("touchstart", activateVideo, {
        once: true,
      });

      const videoTimeline = gsap.timeline({
        defaults: { duration: 1 },
        scrollTrigger: {
          trigger: containerElement,
          pin: true,
          start: "top top",
          end: "+=100%",
          scrub: true,
          markers: false,
          onUpdate: (self) => {
            frameNumber = (self.progress / 14) * 100 - 1; // Adjust FPS-based calculation here
            videoElement.currentTime = Math.min(
              frameNumber,
              videoElement.duration - 0.1
            );
          },
          onLeave: () => {
            // Set video to the last frame explicitly
            videoElement.currentTime = videoElement.duration - 0.1;
            videoElement.pause();
          },
          onLeaveBack: () => {
            // Reset video to the first frame when scrolling back
            videoElement.currentTime = 0;
          },
        },
      });

      return () => {
        videoElement.removeEventListener("loadedmetadata", preloadVideo);
        document.documentElement.removeEventListener(
          "touchstart",
          activateVideo
        );
      };
    }, videoContainerRef);

    return () => {
      ctx.revert(); // Cleans up animations and ScrollTriggers within the context
    };
  }, []);

  return (
    <section
      ref={videoContainerRef}
      className="video-container"
      style={{
        backgroundImage: `url('/images/video_bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <video
        ref={videoRef}
        src="/videos/amali–figma_2.mp4"
        muted
        className="video-scroll"
      />
    </section>
  );
};

export default PinVideo;
