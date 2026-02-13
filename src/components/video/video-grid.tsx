'use client';
import { useAppContext } from '@/contexts/app-context';
import VideoTile from './video-tile';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import PlayerControls from './player-controls';

function SyncControls() {
    const { videoRefs, slots } = useAppContext();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1.0);

    // Helper to get all valid, connected video elements
    const getActiveVideos = () => {
        return videoRefs.current.filter(video => video !== null && video.isConnected);
    };

    useEffect(() => {
        const activeVideos = getActiveVideos();
        // Use the first active video as the master for UI updates
        const masterVideo = activeVideos[0];
        
        if (masterVideo) {
            const updateState = () => {
                setIsPlaying(!masterVideo.paused);
                setCurrentTime(masterVideo.currentTime);
                setDuration(masterVideo.duration || 0);
                setPlaybackRate(masterVideo.playbackRate);
            };
            
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
    }, [videoRefs, slots]);

    const handlePlayPause = () => {
        const activeVideos = getActiveVideos();
        const shouldPlay = !isPlaying;
        
        activeVideos.forEach(video => {
            if (shouldPlay) {
                if (video.ended) video.currentTime = 0;
                video.play().catch(e => console.error("Sync play failed for video:", e));
            } else {
                video.pause();
            }
        });
        
        setIsPlaying(shouldPlay);
    };
    
    const handleSeek = (time: number) => {
        const activeVideos = getActiveVideos();
        activeVideos.forEach(video => {
            if (video) video.currentTime = time;
        });
        setCurrentTime(time);
    };

    const handleRateChange = (rate: number) => {
        const activeVideos = getActiveVideos();
        activeVideos.forEach(video => {
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
