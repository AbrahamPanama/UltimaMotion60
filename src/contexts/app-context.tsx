'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import type { Video } from '@/types';
import { initDB, getAllVideos, addVideo as addVideoDB, deleteVideo as deleteVideoDB } from '@/lib/db';
import { useToast } from "@/hooks/use-toast";

const MAX_SLOTS = 4;

type Layout = 1 | 2 | 4;

interface AppContextType {
  library: Video[];
  loadLibrary: () => Promise<void>;
  addVideoToLibrary: (video: Omit<Video, 'id' | 'url' | 'createdAt'>) => Promise<void>;
  removeVideoFromLibrary: (id: string) => Promise<void>;
<<<<<<< HEAD
  
  slots: (Video | null)[];
  setSlot: (index: number, video: Video | null) => void;
  
  layout: Layout;
  setLayout: (layout: Layout) => void;
  
  isSyncEnabled: boolean;
  toggleSync: () => void;
  
=======

  slots: (Video | null)[];
  setSlot: (index: number, video: Video | null) => void;

  layout: Layout;
  setLayout: (layout: Layout) => void;

  isSyncEnabled: boolean;
  toggleSync: () => void;

  isPortraitMode: boolean;
  togglePortraitMode: () => void;

>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
  activeTileIndex: number | null;
  setActiveTileIndex: (index: number | null) => void;

  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [library, setLibrary] = useState<Video[]>([]);
  const [slots, setSlots] = useState<(Video | null)[]>(Array(MAX_SLOTS).fill(null));
  const [layout, setLayout] = useState<Layout>(1);
  const [isSyncEnabled, setIsSyncEnabled] = useState<boolean>(false);
<<<<<<< HEAD
=======
  const [isPortraitMode, setIsPortraitMode] = useState<boolean>(false);
>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
  const [activeTileIndex, setActiveTileIndex] = useState<number | null>(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const { toast } = useToast();

  const loadLibrary = useCallback(async () => {
    try {
      await initDB();
      const videosFromDB = await getAllVideos();
      const videosWithUrls = videosFromDB.map(v => ({ ...v, url: URL.createObjectURL(v.blob) }));
      setLibrary(videosWithUrls);
    } catch (error) {
      console.error('Failed to load video library:', error);
      toast({ title: "Error", description: "Could not load video library.", variant: "destructive" });
    }
  }, [toast]);

  useEffect(() => {
    loadLibrary();

    return () => {
      library.forEach(video => URL.revokeObjectURL(video.url));
    };
<<<<<<< HEAD
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
=======
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, MAX_SLOTS);
  }, []);


  const addVideoToLibrary = async (videoData: Omit<Video, 'id' | 'url' | 'createdAt'>) => {
    try {
      const newVideo: Omit<Video, 'url'> = {
        ...videoData,
<<<<<<< HEAD
        id: crypto.randomUUID(),
=======
        id: (typeof crypto.randomUUID === 'function')
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
        createdAt: new Date(),
      };
      await addVideoDB(newVideo);
      await loadLibrary();
      toast({ title: "Success", description: "Video saved to library." });
    } catch (error) {
      console.error('Failed to add video:', error);
      toast({ title: "Error", description: "Failed to save video.", variant: "destructive" });
    }
  };

  const removeVideoFromLibrary = async (id: string) => {
    try {
      await deleteVideoDB(id);
      setSlots(prevSlots => prevSlots.map(s => s?.id === id ? null : s));
      await loadLibrary();
      toast({ title: "Success", description: "Video removed from library." });
    } catch (error) {
      console.error('Failed to remove video:', error);
      toast({ title: "Error", description: "Failed to remove video.", variant: "destructive" });
    }
  };

  const setSlot = (index: number, video: Video | null) => {
    setSlots(prevSlots => {
      const newSlots = [...prevSlots];
      if (index >= 0 && index < MAX_SLOTS) {
        newSlots[index] = video;
      }
      return newSlots;
    });
  };

  const handleSetLayout = (newLayout: Layout) => {
    setLayout(newLayout);
    if (activeTileIndex !== null && activeTileIndex >= newLayout) {
      setActiveTileIndex(0);
    } else if (activeTileIndex === null) {
      setActiveTileIndex(0);
    }
  };

  const toggleSync = () => setIsSyncEnabled(prev => !prev);
<<<<<<< HEAD
  
=======
  const togglePortraitMode = () => setIsPortraitMode(prev => !prev);

>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
  const handleSetActiveTileIndex = (index: number | null) => {
    if (index !== null && index >= layout) {
      setActiveTileIndex(0);
    } else {
      setActiveTileIndex(index);
    }
  };

  const value = {
    library,
    loadLibrary,
    addVideoToLibrary,
    removeVideoFromLibrary,
    slots,
    setSlot,
    layout,
    setLayout: handleSetLayout,
    isSyncEnabled,
    toggleSync,
<<<<<<< HEAD
=======
    isPortraitMode,
    togglePortraitMode,
>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
    activeTileIndex,
    setActiveTileIndex: handleSetActiveTileIndex,
    videoRefs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
