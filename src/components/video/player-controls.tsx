'use client';

import { Play, Pause, FastForward } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  playbackRate: number;
  onRateChange: (rate: number) => void;
  isSyncEnabled: boolean;
}

const PLAYBACK_RATES = [1.0, 0.5, 0.25, 0.125];

export default function PlayerControls({
  isPlaying,
  onPlayPause,
  currentTime,
  duration,
  onSeek,
  playbackRate,
  onRateChange,
  isSyncEnabled,
}: PlayerControlsProps) {
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isSyncEnabled) {
    return (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100">
            <p className="text-white font-medium text-lg">Sync Active</p>
        </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-white">
        <Button variant="ghost" size="icon" onClick={onPlayPause} className="hover:bg-white/20">
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <span className="text-xs font-mono w-12">{formatTime(currentTime)}</span>
        <Slider
          min={0}
          max={duration || 1}
          step={0.1}
          value={[currentTime]}
          onValueChange={(value) => onSeek(value[0])}
          className="w-full"
        />
        <span className="text-xs font-mono w-12 text-right">{formatTime(duration)}</span>
        <Select
            value={playbackRate.toString()}
            onValueChange={(value) => onRateChange(parseFloat(value))}
        >
            <SelectTrigger className="w-[80px] h-8 bg-black/30 border-white/30 text-white">
                 <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {PLAYBACK_RATES.map((rate) => (
                    <SelectItem key={rate} value={rate.toString()}>{rate.toFixed(2)}x</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
    </div>
  );
}
