'use client';
import { useAppContext } from '@/contexts/app-context';
import VideoTile from './video-tile';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import PlayerControls from './player-controls';

function SyncControls() {
    const { videoRefs, slots } = useAppContext(); // Added slots to dependencies
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1.0);

    // Effect to bind listeners to the "Master" video (the first available one)
    useEffect(() => {
        // Find the first valid video element to act as master
        const masterVideo = videoRefs.current.find(ref => ref !== null);
        
        if (masterVideo) {
            const updateState = () => {
                setIsPlaying(!masterVideo.paused);
                setCurrentTime(masterVideo.currentTime);
                setDuration(masterVideo.duration || 0);
                setPlaybackRate(masterVideo.playbackRate);
            };
            
            // Sync initial state
            updateState();

            masterVideo.addEventListener('play', updateState);
            masterVideo.addEventListener('pause', updateState);
            masterVideo.addEventListener('timeupdate', updateState);
            masterVideo.addEventListener('ratechange', updateState);
            masterVideo.addEventListener('loadedmetadata', updateState);

            return () => {
                masterVideo.removeEventListener('play', updateState);
                masterVideo.removeEventListener('pause', updateState);
                masterVideo.removeEventListener('timeupdate', updateState);
                masterVideo.removeEventListener('ratechange', updateState);
                masterVideo.removeEventListener('loadedmetadata', updateState);
            };
        }
    }, [videoRefs, slots]); // Re-run when videos are added/removed

    const handlePlayPause = () => {
        const shouldPlay = !isPlaying;
        
        // Apply to all active videos
        videoRefs.current.forEach(video => {
            if (video) {
                if (shouldPlay) {
                    video.play().catch(e => console.warn("Play interrupted", e));
                } else {
                    video.pause();
                }
            }
        });
        setIsPlaying(shouldPlay);
    };
    
    const handleSeek = (time: number) => {
        videoRefs.current.forEach(video => {
            if (video) video.currentTime = time;
        });
        setCurrentTime(time);
    };

    const handleRateChange = (rate: number) => {
        videoRefs.current.forEach(video => {
            if (video) video.playbackRate = rate;
        });
        setPlaybackRate(rate);
    };
    
    return (
        <div className="bg-card p-2 border rounded-lg shadow-sm mt-auto">
            <PlayerControls 
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                playbackRate={playbackRate}
                onRateChange={handleRateChange}
                isSyncEnabled={false} 
                variant="static"
            />
        </div>
    );
}


export default function VideoGrid() {
  const { layout, slots, activeTileIndex, isSyncEnabled } = useAppContext();
  
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    4: 'grid-cols-2',
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
        <div className={cn('grid gap-4 flex-1 content-start min-h-0', gridClasses[layout])}>
        {slots.slice(0, layout).map((video, index) => (
            <VideoTile
            key={index}
            video={video}
            index={index}
            isActive={activeTileIndex === index}
            />
        ))}
        </div>
        {isSyncEnabled && <SyncControls />}
    </div>
  );
}
