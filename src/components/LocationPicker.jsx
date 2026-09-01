import React, { useState, useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {
  RESTAURANT_COORDS,
  searchAddressFree,
  reverseGeocodeCoords,
  calculateKmFromCoords,
  getDrivingDistance,
  getDeliveryPricing,
} from '../utils/deliveryUtils';

// ---- Fix del bug común de los iconos de Leaflet en React (Vite) ----
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Pin personalizado en color ámbar (estilo PedidosYa)
const amberPinIcon = L.divIcon({
  className: 'location-pin-icon',
  html: `
    <svg width="38" height="46" viewBox="0 0 38 46" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 1C9.06 1 1 9.06 1 19c0 13.5 18 26 18 26s18-12.5 18-26C37 9.06 28.94 1 19 1z" fill="#F59E0B" stroke="#18181B" stroke-width="1.5"/>
      <circle cx="19" cy="18.5" r="8.5" fill="#18181B" stroke="#FCD34D" stroke-width="1.5"/>
    </svg>
  `,
  iconSize: [38, 46],
  iconAnchor: [19, 46],
});

// Centra el mapa en una posición cuando se dispara flyTrigger (ej. geolocalización o búsqueda)
function MapController({ position, flyTrigger, flyZoom }) {
  const map = useMap();

  useEffect(() => {
    if (flyTrigger > 0 && position && position.length === 2) {
      map.flyTo(position, flyZoom || 17, { duration: 1.2 });
    }
  }, [flyTrigger, flyZoom, position, map]);

  return null;
}

export default function LocationPicker({ locationData, setLocationData }) {
  const initialPosition = useMemo(
    () =>
      locationData?.latitude && locationData?.longitude
        ? [locationData.latitude, locationData.longitude]
        : [RESTAURANT_COORDS.lat, RESTAURANT_COORDS.lon],
    [locationData],
  );

  const [position, setPosition] = useState(initialPosition);
  const [flyTrigger, setFlyTrigger] = useState(0);
  const [flyZoom, setFlyZoom] = useState(17);
  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [building, setBuilding] = useState(locationData?.building || '');
  const [reference, setReference] = useState(locationData?.reference || '');
  const [addressText, setAddressText] = useState(
    locationData?.addressText || '',
  );

  // Distancia y tarifa en vivo según el pin actual y el texto de la dirección
  const [distanceKm, setDistanceKm] = useState(() =>
    position && position.length === 2
      ? calculateKmFromCoords(position[0], position[1])
      : null,
  );
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);

  useEffect(() => {
    if (!position || position.length !== 2) {
      setDistanceKm(null);
      setIsCalculatingDistance(false);
      return;
    }

    let cancelled = false;
    setIsCalculatingDistance(true);
    getDrivingDistance(
      { lat: position[0], lng: position[1] },
      { lat: RESTAURANT_COORDS.lat, lng: RESTAURANT_COORDS.lon },
    ).then((km) => {
      if (cancelled) return;
      setDistanceKm(km);
      setIsCalculatingDistance(false);
    });
    return () => {
      cancelled = true;
    };
  }, [position]);

  const pricing = getDeliveryPricing({
    distanceKm,
    addressText,
  });

  // Búsqueda de zonas/direcciones
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef(null);

  // Limpiar el temporizador de búsqueda al desmontar
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  const isConfirmed = Boolean(locationData);

  // Reverse geocoding para detectar la zona desde las coordenadas del pin
  const updateAddressFromCoords = async (lat, lng) => {
    const name = await reverseGeocodeCoords(lat, lng);
    if (name) {
      setAddressText(name);
    }
  };

  const handleUseMyLocation = () => {
    setErrorMsg('');
    if (!navigator.geolocation) {
      setErrorMsg('Tu navegador no soporta geolocalización.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setFlyZoom(17);
        setFlyTrigger((t) => t + 1);
        setIsLocating(false);
        updateAddressFromCoords(latitude, longitude);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg(
            'Permiso denegado. Activa la ubicación en tu navegador y vuelve a intentar.',
          );
        } else {
          setErrorMsg('No se pudo obtener tu ubicación. Inténtalo de nuevo.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
  };

  const searchZones = async (text) => {
    const cleanText = (text || '').trim();
    if (cleanText.length < 3) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const data = await searchAddressFree(cleanText);
    setSearchResults(Array.isArray(data) ? data : []);
    setIsSearching(false);
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length >= 3) {
      debounceRef.current = setTimeout(() => searchZones(value), 500);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    searchZones(query);
  };

  const handleQueryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleSelectResult = (place) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);

    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    setPosition([lat, lng]);
    setFlyZoom(16);
    setFlyTrigger((t) => t + 1);
    setQuery(place.display_name || query);
    setAddressText(place.display_name || '');
    setSearchResults([]);

    // Si ya hay una ubicación confirmada, actualiza las coordenadas con el nuevo pin
    if (locationData) {
      setLocationData({
        ...locationData,
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        googleMapsUrl: `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`,
        addressText: place.display_name || locationData.addressText || '',
      });
    }
  };

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    setPosition([lat, lng]);
    updateAddressFromCoords(lat, lng);

    if (locationData) {
      setLocationData({
        ...locationData,
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        googleMapsUrl: `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`,
      });
    }
  };

  const handleConfirm = () => {
    if (!building.trim()) {
      setErrorMsg('Por favor indica el edificio, residencia o casa.');
      return;
    }

    const [lat, lng] = position;
    const formattedLat = Number(lat.toFixed(6));
    const formattedLng = Number(lng.toFixed(6));

    setLocationData({
      latitude: formattedLat,
      longitude: formattedLng,
      googleMapsUrl: `https://www.google.com/maps?q=${formattedLat},${formattedLng}`,
      building: building.trim(),
      reference: reference.trim(),
      addressText: addressText.trim(),
    });
    setErrorMsg('');
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 space-y-3">
      <p className="text-xs font-bold text-amber-400 flex items-center gap-1">
        📍 Selecciona tu ubicación de entrega
      </p>

      {/* Buscador de zonas / direcciones */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleQueryKeyDown}
            placeholder="Buscar zona, sector o avenida..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 pr-10 text-xs text-zinc-100 caret-amber-500 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />
          <button
            type="button"
            onClick={handleSearchSubmit}
            disabled={isSearching}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-amber-500 hover:text-amber-400 disabled:opacity-50 transition-colors"
            aria-label="Buscar"
          >
            {isSearching ? (
              <span className="block w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="block text-sm leading-none">🔍</span>
            )}
          </button>
        </div>

        {searchResults.length > 0 && (
          <ul className="absolute z-[2000] w-full bg-zinc-950 border border-zinc-700 rounded-lg max-h-48 overflow-y-auto mt-1 shadow-2xl">
            {searchResults.map((item) => (
              <li
                key={item.place_id}
                onClick={() => handleSelectResult(item)}
                className="p-2.5 hover:bg-zinc-800 cursor-pointer text-xs text-zinc-200 border-b border-zinc-800 last:border-none"
              >
                📍 {item.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa */}
      <div className="relative rounded-lg overflow-hidden border border-zinc-700">
        <MapContainer
          center={initialPosition}
          zoom={17}
          scrollWheelZoom={false}
          className="location-map"
        >
          <TileLayer
            className="map-tiles dark-map"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController
            position={position}
            flyTrigger={flyTrigger}
            flyZoom={flyZoom}
          />
          <Marker
            position={position}
            draggable
            icon={amberPinIcon}
            eventHandlers={{ dragend: handleMarkerDragEnd }}
          />
        </MapContainer>

        {/* Botón de geolocalización */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="absolute top-2 right-2 z-[1000] bg-zinc-900/95 border border-zinc-700 hover:border-amber-500 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-full shadow-lg transition-colors flex items-center gap-1 active:scale-95"
        >
          {isLocating ? (
            <>
              <span className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              Obteniendo...
            </>
          ) : (
            <>📍 Usar mi ubicación actual</>
          )}
        </button>
      </div>

      {errorMsg && <p className="text-[11px] text-red-400">{errorMsg}</p>}

      <p className="text-[11px] text-zinc-400 text-center -mt-1.5">
        Arrastra el pin 📌 para ajustar la posición exacta
      </p>

      {/* Distancia y costo estimado del envío */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Distancia desde el local:</span>
          <span className="font-bold text-white">
            {isCalculatingDistance
              ? 'calculando…'
              : distanceKm != null
                ? `${distanceKm.toFixed(2)} km`
                : '—'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Costo de envío:</span>
          <span className="font-bold text-amber-400 text-sm">
            {isCalculatingDistance
              ? '…'
              : `$${Number(pricing.price || 0).toFixed(2)}`}
          </span>
        </div>
      </div>

      {/* Campos de dirección */}
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Edificio / Residencia / Casa *
          </label>
          <input
            type="text"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            placeholder="Ej: Edf. Los Andes, Torre B, Apto 4..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 caret-amber-500 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Punto de referencia
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Ej: Frente a la panadería, al lado del abasto..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 caret-amber-500 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-black font-bold rounded-lg text-xs transition-colors"
      >
        {isConfirmed ? '✓ Actualizar Ubicación' : 'Confirmar Ubicación'}
      </button>

      {isConfirmed && (
        <div className="bg-amber-950/30 border border-amber-600/40 rounded-lg p-2.5 text-[11px] text-amber-200/90 space-y-1">
          <p className="font-semibold text-amber-400">✓ Ubicación confirmada</p>
          <p>{locationData.building}</p>
          {locationData.reference && <p>Ref: {locationData.reference}</p>}
          <a
            href={locationData.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-amber-400 underline inline-flex items-center gap-1"
          >
            🌐 Ver en Google Maps
          </a>
        </div>
      )}
    </div>
  );
}