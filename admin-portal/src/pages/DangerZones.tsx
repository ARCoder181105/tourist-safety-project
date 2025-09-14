import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Polygon } from '@react-google-maps/api';
import { Loader2, MapPin, AlertTriangle, Trash2, Plus, Info, RefreshCw } from 'lucide-react';

const mapContainerStyle = {
  height: "100%",
  width: "100%"
};

const defaultCenter = {
  lat: 18.5204, // Pune, India
  lng: 73.8567
};

// Generate a unique ID for zones
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

const DangerZonesPage = () => {
  const [zones, setZones] = useState([]);
  const [zoneName, setZoneName] = useState('');
  const [zoneWarning, setZoneWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  
  const mapRef = useRef();
  const drawingManagerRef = useRef();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'DEMO_KEY',
    libraries: ['drawing'],
    region: 'IN'
  });

  // Initialize with some sample zones for demonstration
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const sampleZones = [
        {
          _id: generateId(),
          name: 'Flood Prone Area',
          warning: 'Avoid during heavy rains. Risk of flooding.',
          coordinates: [[
            [73.85, 18.52],
            [73.86, 18.52],
            [73.86, 18.53],
            [73.85, 18.53],
            [73.85, 18.52]
          ]]
        },
        {
          _id: generateId(),
          name: 'Landslide Zone',
          warning: 'Unstable terrain. Avoid during monsoon season.',
          coordinates: [[
            [73.84, 18.51],
            [73.845, 18.51],
            [73.845, 18.515],
            [73.84, 18.515],
            [73.84, 18.51]
          ]]
        }
      ];
      setZones(sampleZones);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Initialize drawing manager when map is ready
  useEffect(() => {
    if (!map || !window.google || !window.google.maps) return;
    
    if (drawingMode) {
      // Create a new drawing manager
      const newDrawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON]
        },
        polygonOptions: {
          fillColor: '#EF4444',
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: '#EF4444',
          clickable: true,
          editable: false,
          zIndex: 1
        }
      });
      
      // Set the drawing manager on the map
      newDrawingManager.setMap(map);
      drawingManagerRef.current = newDrawingManager;
      
      // Add event listener for polygon complete
      window.google.maps.event.addListener(
        newDrawingManager, 
        'polygoncomplete', 
        (polygon) => {
          onPolygonComplete(polygon);
        }
      );
    } else if (drawingManagerRef.current) {
      // Remove drawing manager when not in drawing mode
      drawingManagerRef.current.setMap(null);
      drawingManagerRef.current = null;
    }
    
    return () => {
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(null);
      }
    };
  }, [map, drawingMode]);

  const onPolygonComplete = (polygon) => {
    if (!zoneName || !zoneWarning) {
      setError("Please enter a name and warning message for the new zone before saving.");
      polygon.setMap(null);
      return;
    }

    const path = polygon.getPath();
    const coordinates = path.getArray().map(latLng => [latLng.lng(), latLng.lat()]);
    
    // Close the polygon if it's not already closed
    if (coordinates.length > 0) {
      coordinates.push([coordinates[0][0], coordinates[0][1]]);
    }

    try {
      // Create a new zone object
      const newZone = {
        _id: generateId(),
        name: zoneName, 
        warning: zoneWarning, 
        coordinates: [coordinates]
      };
      
      // Update the zones array with the new zone
      setZones(prevZones => [newZone, ...prevZones]);
      
      setSuccess("Danger zone created successfully!");
      setError(null);
      setZoneName('');
      setZoneWarning('');
      setDrawingMode(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error creating zone:", err);
      setError("Failed to create danger zone.");
    } finally {
      polygon.setMap(null);
    }
  };

  const handleDeleteZone = (zoneId) => {
    if (window.confirm("Are you sure you want to delete this zone?")) {
      // Remove the zone from the array
      setZones(prevZones => prevZones.filter(zone => zone._id !== zoneId));
      setSuccess("Zone deleted successfully!");
      setError(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const startDrawing = () => {
    if (!zoneName || !zoneWarning) {
      setError("Please enter a zone name and warning message first.");
      return;
    }
    setDrawingMode(true);
    setError(null);
  };

  const onMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;
    setMap(mapInstance);
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Google Maps Failed to Load</h2>
          <p className="text-gray-600 mb-4">Please check your API key and try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-2" />
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full lg:w-1/3 p-6 bg-white shadow-lg overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Danger Zones Management</h2>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            title="Refresh page"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium">Error: </span>
              {error}
            </div>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-800"
            >
              ×
            </button>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex">
            <span className="font-medium">Success: </span>
            {success}
            <button 
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-800"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Create New Zone Card */}
        <div className="mb-6 p-5 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-blue-600" />
            Create New Danger Zone
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Zone Name *</label>
            <input 
              type="text" 
              placeholder="e.g., Flood Prone Area" 
              value={zoneName} 
              onChange={e => setZoneName(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Warning Message *</label>
            <textarea 
              placeholder="Warning message for tourists" 
              value={zoneWarning} 
              onChange={e => setZoneWarning(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              rows={2}
              required
            />
          </div>
          
          <div className="bg-blue-100 p-3 rounded-lg mb-4 flex items-start">
            <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              1. Fill in the details above.<br />
              2. Click "Start Drawing" to enable the drawing tool.<br />
              3. Draw the zone on the map and click the first point to finish.
            </p>
          </div>
          
          <button 
            onClick={startDrawing}
            disabled={!zoneName.trim() || !zoneWarning.trim() || drawingMode}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
              !zoneName.trim() || !zoneWarning.trim() || drawingMode
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
            }`}
          >
            <MapPin className="h-5 w-5 mr-2" />
            {drawingMode ? 'Drawing Mode Active' : 'Start Drawing on Map'}
          </button>
          
          {drawingMode && (
            <div className="mt-3 p-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm text-center flex items-center">
              <Info className="h-4 w-4 mr-1" />
              Drawing mode active - Draw a polygon on the map
            </div>
          )}
        </div>
        
        {/* Existing Zones Section */}
        <div>
          <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Existing Danger Zones ({zones.length})
          </h3>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
            </div>
          ) : zones.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p>No danger zones created yet</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {zones.map(zone => (
                <li key={zone._id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex justify-between items-start">
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 block">{zone.name}</span>
                    <span className="text-sm text-gray-600 block mt-1">{zone.warning}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteZone(zone._id)} 
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors ml-2"
                    title="Delete zone"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Map Section */}
      <div className="w-full lg:w-2/3 relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={12}
          mapId="SENTINEL_DANGER_ZONE_MAP"
          onLoad={onMapLoad}
          options={{
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "on" }]
              }
            ]
          }}
        >
          {zones.map(zone => (
            <Polygon
              key={zone._id}
              paths={zone.coordinates[0].map(p => ({ lat: p[1], lng: p[0] }))}
              options={{ 
                fillColor: '#EF4444', 
                fillOpacity: 0.2, 
                strokeWeight: 2, 
                strokeColor: '#EF4444',
                editable: false
              }}
            />
          ))}
        </GoogleMap>
        
        {/* Map Overlay Info */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm font-medium">Danger Zones</span>
        </div>
        
        {drawingMode && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Drawing Mode Active - Draw a polygon on the map
          </div>
        )}
      </div>
    </div>
  );
};

export default DangerZonesPage;