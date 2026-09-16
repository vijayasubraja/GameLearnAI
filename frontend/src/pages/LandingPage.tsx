import React, { useState } from 'react';
import { GameWorld } from '../components/world/GameWorld';
import { GameHud } from '../components/landing/GameHud';
import { LocationPopup } from '../components/landing/LocationPopup';
import { AccessibleFallbackView } from '../components/landing/AccessibleFallbackView';
import { worldLocationByKey } from '../components/world/worldConfig';

export const LandingPage: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [is2DView, setIs2DView] = useState(false);
  const [exploreNonce, setExploreNonce] = useState(0);

  const handleSelectZone = (zoneKey: string) => {
    setSelectedZone((prev) => (prev === zoneKey ? null : zoneKey));
  };

  const handleResetView = () => {
    setSelectedZone(null);
    setExploreNonce((n) => n + 1);
  };

  const selectedLocation = selectedZone ? worldLocationByKey(selectedZone) : undefined;

  return (
    <div className="relative h-screen w-screen select-none overflow-hidden bg-[#BFE7FF] font-sans">
      {!is2DView ? (
        <GameWorld
          selected={selectedZone}
          onSelect={handleSelectZone}
          exploreNonce={exploreNonce}
        />
      ) : (
        <AccessibleFallbackView
          selectedZone={selectedZone}
          onSelectZone={handleSelectZone}
        />
      )}

      <GameHud
        selected={Boolean(selectedLocation)}
        onResetView={handleResetView}
        is2DView={is2DView}
        onToggle2DView={() => setIs2DView(!is2DView)}
      />

      {selectedLocation && (
        <LocationPopup location={selectedLocation} onClose={handleResetView} />
      )}
    </div>
  );
};

export default LandingPage;