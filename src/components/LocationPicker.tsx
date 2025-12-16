import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import locationLib, { Coords } from '@/lib/location';

const LocationPicker: React.FC<{ apiKey?: string; onChange?: (data: { coords: Coords; address?: string }) => void }> = ({ apiKey, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const getLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await locationLib.getAddressFromCurrentLocation(apiKey);
      setAddress(result.address || 'Address not found');
      onChange?.({ coords: { lat: result.lat, lng: result.lng }, address: result.address });
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button size="sm" onClick={getLocation} disabled={loading} className="px-3">
        {loading ? 'Detecting…' : 'Detect my location'}
      </Button>
      {address && <div className="text-sm text-muted-foreground">{address}</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
};

export default LocationPicker;
