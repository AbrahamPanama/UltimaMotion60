'use client';
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Video as VideoIcon, Mic, XCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/app-context';

export function VideoRecorder() {
  const { addVideoToLibrary } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [videoName, setVideoName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 60, max: 60 } },
        audio: true,
      });

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoURL = URL.createObjectURL(blob);
        if(videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = null;
            videoPreviewRef.current.src = videoURL;
            videoPreviewRef.current.controls = true;
            videoPreviewRef.current.play();
        }
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing media devices.', err);
      setError('Could not access camera/microphone. Please check permissions.');
      toast({ title: 'Error', description: 'Could not access camera/microphone.', variant: 'destructive' });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all tracks to turn off the camera light
      const stream = videoPreviewRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    }
  }, []);

  const handleSave = async () => {
    if (recordedChunksRef.current.length === 0) {
      toast({ title: 'Warning', description: 'No video recorded to save.' });
      return;
    }
    if (!videoName.trim()) {
      toast({ title: 'Warning', description: 'Please enter a name for the video.' });
      return;
    }

    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
    
    // Get duration
    const tempVideo = document.createElement('video');
    tempVideo.src = URL.createObjectURL(blob);
    tempVideo.onloadedmetadata = async () => {
        await addVideoToLibrary({
            name: videoName,
            blob,
            duration: tempVideo.duration,
        });
        URL.revokeObjectURL(tempVideo.src);
        handleClose();
    };
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    setIsOpen(false);
    setIsRecording(false);
    setVideoName('');
    setError(null);
    recordedChunksRef.current = [];
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
      videoPreviewRef.current.src = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Button onClick={() => setIsOpen(true)} variant="outline" className="w-full">
        <VideoIcon className="mr-2" />
        Record Video
      </Button>
      <DialogContent className="sm:max-w-[800px] bg-card">
        <DialogHeader>
          <DialogTitle>Video Recorder</DialogTitle>
          <DialogDescription>
            Record a new video clip. Aiming for 720p at 60fps.
          </DialogDescription>
        </DialogHeader>
        
        <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
            <video ref={videoPreviewRef} playsInline autoPlay muted className="w-full h-full object-cover"></video>
        </div>

        {error && (
            <div className="text-destructive text-sm flex items-center gap-2"><XCircle/> {error}</div>
        )}

        {recordedChunksRef.current.length > 0 && !isRecording && (
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="videoName">Video Name</Label>
            <Input
              id="videoName"
              type="text"
              value={videoName}
              onChange={(e) => setVideoName(e.target.value)}
              placeholder="e.g., Backhand Practice"
            />
          </div>
        )}

        <DialogFooter className="sm:justify-between items-center">
          <p className="text-xs text-muted-foreground text-left">
            Actual recording settings may vary based on device and browser.
          </p>
          <div className="flex gap-2">
            {!isRecording && recordedChunksRef.current.length > 0 ? (
                 <>
                    <Button variant="outline" onClick={startRecording}>Record Again</Button>
                    <Button onClick={handleSave}>Save Video</Button>
                </>
            ) : (
                <Button onClick={isRecording ? stopRecording : startRecording} className="w-[140px]">
                    {isRecording ? (
                        <>
                        <Mic className="mr-2 animate-pulse" />
                        Stop Recording
                        </>
                    ) : (
                        <>
                        <VideoIcon className="mr-2" />
                        Start Recording
                        </>
                    )}
                </Button>
            )}
             <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
