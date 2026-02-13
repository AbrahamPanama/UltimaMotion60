'use client';
import { useAppContext } from '@/contexts/app-context';
import VideoTile from './video-tile';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import PlayerControls from './player-controls';

function SyncControls() {
    const { videoRefs } = useAppContext();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1.0);

    useEffect(() => {
        const firstVideo = videoRefs.current[0];
        if (firstVideo) {
            const updateState = () => {
                setIsPlaying(!firstVideo.paused);
                setCurrentTime(firstVideo.currentTime);
                setDuration(firstVideo.duration || 0);
                setPlaybackRate(firstVideo.playbackRate);
            };
            updateState();
            firstVideo.addEventListener('play', updateState);
            firstVideo.addEventListener('pause', updateState);
            firstVideo.addEventListener('timeupdate', updateState);
            firstVideo.addEventListener('ratechange', updateState);

            return () => {
                firstVideo.removeEventListener('play', updateState);
                firstVideo.removeEventListener('pause', updateState);
                firstVideo.removeEventListener('timeupdate', updateState);
                firstVideo.removeEventListener('ratechange', updateState);
            };
        }
    }, [videoRefs]);

    const handlePlayPause = () => {
        const play = !isPlaying;
        videoRefs.current.forEach(video => {
            if (video) {
                if (play) video.play();
                else video.pause();
            }
        });
        setIsPlaying(play);
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
        <div className="bg-card p-2 border rounded-lg shadow-sm">
            <PlayerControls 
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                playbackRate={playbackRate}
                onRateChange={handleRateChange}
                isSyncEnabled={false} // Pass false to ensure controls are rendered
                variant="static"      // Render as static toolbar, not overlay
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
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className={cn('grid gap-4 flex-1 content-start', gridClasses[layout])}>
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
