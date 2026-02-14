'use client';
import { useAppContext } from '@/contexts/app-context';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
<<<<<<< HEAD
import { Square, Rows, Grid, RadioTower } from 'lucide-react';

export default function MainControls() {
  const { layout, setLayout, isSyncEnabled, toggleSync } = useAppContext();
=======
import { Square, Rows, Grid, RadioTower, Smartphone } from 'lucide-react';

export default function MainControls() {
  const { layout, setLayout, isSyncEnabled, toggleSync, isPortraitMode, togglePortraitMode } = useAppContext();
>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <Label>Layout:</Label>
        <Button
          variant={layout === 1 ? 'default' : 'ghost'}
          size="icon"
          onClick={() => setLayout(1)}
        >
          <Square className="h-5 w-5" />
          <span className="sr-only">1 Tile Layout</span>
        </Button>
        <Button
          variant={layout === 2 ? 'default' : 'ghost'}
          size="icon"
          onClick={() => setLayout(2)}
        >
          <Rows className="h-5 w-5" />
          <span className="sr-only">2 Tile Layout</span>
        </Button>
        <Button
          variant={layout === 4 ? 'default' : 'ghost'}
          size="icon"
          onClick={() => setLayout(4)}
        >
          <Grid className="h-5 w-5" />
          <span className="sr-only">4 Tile Layout</span>
        </Button>
      </div>
<<<<<<< HEAD
      <div className="flex items-center space-x-2">
        <RadioTower className="h-5 w-5 text-muted-foreground"/>
        <Label htmlFor="sync-mode" className="font-medium">
          Sync Playback
        </Label>
        <Switch
          id="sync-mode"
          checked={isSyncEnabled}
          onCheckedChange={toggleSync}
        />
=======
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Smartphone className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="portrait-mode" className="font-medium">
            Portrait
          </Label>
          <Switch
            id="portrait-mode"
            checked={isPortraitMode}
            onCheckedChange={togglePortraitMode}
          />
        </div>
        <div className="flex items-center space-x-2">
          <RadioTower className="h-5 w-5 text-muted-foreground" />
          <Label htmlFor="sync-mode" className="font-medium">
            Sync Playback
          </Label>
          <Switch
            id="sync-mode"
            checked={isSyncEnabled}
            onCheckedChange={toggleSync}
          />
        </div>
>>>>>>> 43a2033310da11e35edb0dbc274841712ec3be85
      </div>
    </div>
  );
}
