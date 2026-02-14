'use client';
import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '@/contexts/app-context';
import type { Video } from '@/types';
import PlayerControls from './player-controls';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';

interface VideoTileProps {
  video: Video | null;
  index: number;
  isActive: boolean;
}

export default function VideoTile({ video, index, isActive }: VideoTileProps) {
<<<<<<< HEAD
  const { 
    setActiveTileIndex, 
    videoRefs, 
    isSyncEnabled, 
    library, 
    setSlot 
  } = useAppContext();
  
=======
  const {
    setActiveTileIndex,
    videoRefs,
    isSyncEnabled,
    isPortraitMode,
    library,
    setSlot
  } = useAppContext();

>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const { toast } = useToast();

  // Handle ref assignment and cleanup
  useEffect(() => {
    if (videoRefs.current) {
      videoRefs.current[index] = videoRef.current;
    }
    return () => {
      // Clean up ref on unmount to prevent stale references in SyncControls
      if (videoRefs.current) {
        videoRefs.current[index] = null;
      }
    };
  }, [index, videoRefs, video]);

  // Mute/unmute based on active state
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.muted = !isActive;
  }, [isActive]);

  // Handle all video event listeners, state updates, and looping
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !video) return;

    const handleTimeUpdate = () => {
      const now = videoElement.currentTime;
<<<<<<< HEAD
      
      // Client-side loop enforcement when sync is off
      if (!isSyncEnabled) {
        const end = video.trimEnd || videoElement.duration;
        const start = video.trimStart || 0;
        if (now >= end) {
          videoElement.currentTime = start;
          if (!videoElement.paused) videoElement.play().catch(e => console.warn("Loop play failed", e));
=======
      // Loop logic
      if (video.trimEnd && now >= video.trimEnd) {
        const wasPlaying = !videoElement.paused;
        videoElement.currentTime = video.trimStart || 0;
        if (wasPlaying) {
          videoElement.play().catch(e => console.warn("Loop play failed", e));
>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
        }
      }
      setCurrentTime(videoElement.currentTime);
    };

    const handleDurationChange = () => setDuration(videoElement.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('durationchange', handleDurationChange);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    // Initialize state when video changes
    videoElement.currentTime = video.trimStart || 0;
    setCurrentTime(videoElement.currentTime);
    if (videoElement.duration) setDuration(videoElement.duration);
    setIsPlaying(!videoElement.paused);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
<<<<<<< HEAD
      videoElement.removeEventListener('durationchange',handleDurationChange);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [video, isSyncEnabled]);
  
=======
      videoElement.removeEventListener('durationchange', handleDurationChange);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, [video]);

>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
  const handlePlayPause = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  };

  const handleSeek = (time: number) => {
    const videoElement = videoRef.current;
    if (videoElement) {
      // Clamp seek time within trim range if it exists
      const start = video?.trimStart || 0;
      const end = video?.trimEnd || videoElement.duration;
      videoElement.currentTime = Math.max(start, Math.min(time, end));
      setCurrentTime(videoElement.currentTime);
    }
  };

  const handleRateChange = (rate: number) => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleSelectVideo = (selectedVideo: Video) => {
    setSlot(index, selectedVideo);
    toast({ title: 'Video Added', description: `"${selectedVideo.name}" added to slot ${index + 1}.` });
  };


  if (!video) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            suppressHydrationWarning
<<<<<<< HEAD
            className="bg-muted/50 border-2 border-dashed rounded-lg flex items-center justify-center aspect-video cursor-pointer hover:border-primary transition-colors"
=======
            className={cn(
              "bg-muted/50 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors",
              isPortraitMode ? 'aspect-[9/16]' : 'aspect-video'
            )}
>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
          >
            <div className="text-center text-muted-foreground">
              <PlusCircle className="mx-auto h-12 w-12" />
              <p className="mt-2 font-medium">Add Video</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {library.length > 0 ? (
            library.map(libVideo => (
              <DropdownMenuItem key={libVideo.id} onClick={() => handleSelectVideo(libVideo)}>
                {libVideo.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>Library is empty</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div
      className={cn(
<<<<<<< HEAD
        'relative aspect-video bg-black rounded-lg overflow-hidden group transition-all duration-300',
=======
        'relative bg-black rounded-lg overflow-hidden group transition-all duration-300',
        isPortraitMode ? 'aspect-[9/16]' : 'aspect-video',
>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
        isActive ? 'ring-4 ring-primary shadow-2xl' : 'ring-2 ring-transparent'
      )}
      onClick={() => setActiveTileIndex(index)}
    >
      <video
        ref={videoRef}
        src={video.url}
<<<<<<< HEAD
        className="w-full h-full object-contain"
        loop={!isSyncEnabled}
=======
        className={cn(
          'w-full h-full',
          isPortraitMode ? 'object-cover' : 'object-contain'
        )}
>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
        playsInline
      />
      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        playbackRate={playbackRate}
        onRateChange={handleRateChange}
        isSyncEnabled={isSyncEnabled}
      />
    </div>
  );
}
