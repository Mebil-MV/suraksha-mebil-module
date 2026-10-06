import { useState, useCallback } from 'react';

type GeoState = {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
};

export function useGeoLocation() {
  const [state, setState] = useState<GeoState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: 'Geolocation not supported' }));
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          loading: false,
          error: null,
        });
      },
      (err) => {
        setState((prev) => ({ ...prev, loading: false, error: err.message }));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { ...state, getLocation };
}
