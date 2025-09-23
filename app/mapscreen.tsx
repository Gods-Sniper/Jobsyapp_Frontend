import MapView, { Marker, Polyline } from "react-native-maps";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

export default function MapScreen() {
  const { latitude, longitude, address } = useLocalSearchParams();

  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const hasCoords = latitude && longitude;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc.coords);
    })();
  }, []);

  // Job location
  const jobLat = hasCoords ? Number(latitude) : null;
  const jobLng = hasCoords ? Number(longitude) : null;

  // User location
  const userLat = userLocation?.latitude;
  const userLng = userLocation?.longitude;

  // Fetch route from OpenRouteService
  useEffect(() => {
    if (userLat && userLng && jobLat && jobLng) {
      const fetchRoute = async () => {
        try {
          const res = await fetch(
            `https://api.openrouteservice.org/v2/directions/driving-car?api_key=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBiNTVkN2ExODhkYjQ1ODJiY2JhNDIzOTI3MDBmNDU3IiwiaCI6Im11cm11cjY0In0=&start=${userLng},${userLat}&end=${jobLng},${jobLat}`
          );
          const data = await res.json();
          const coords = data.features[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => ({
              latitude: lat,
              longitude: lng,
            })
          );
          setRouteCoords(coords);
        } catch (err) {
          setRouteCoords([]);
        }
      };
      fetchRoute();
    }
  }, [userLat, userLng, jobLat, jobLng]);

  // Center map between user and job
  const centerLat =
    jobLat && userLat ? (jobLat + userLat) / 2 : jobLat || userLat;
  const centerLng =
    jobLng && userLng ? (jobLng + userLng) / 2 : jobLng || userLng;

  if (!jobLat || !jobLng || !userLat || !userLng) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#40189D" />
        <Text>Getting location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={
          centerLat !== undefined && centerLng !== undefined
            ? {
                latitude: centerLat,
                longitude: centerLng,
                latitudeDelta: Math.abs(jobLat! - userLat!) + 0.02,
                longitudeDelta: Math.abs(jobLng! - userLng!) + 0.02,
              }
            : undefined
        }
        showsUserLocation={true}
      >
        {/* Marker for job address */}
        <Marker
          coordinate={{
            latitude: jobLat,
            longitude: jobLng,
          }}
          title={
            address
              ? Array.isArray(address)
                ? address.join(", ")
                : address
              : "Job Location"
          }
          pinColor="#40189D"
        />
        {/* Marker for user location */}
        <Marker
          coordinate={{
            latitude: userLat,
            longitude: userLng,
          }}
          title="Your Position"
          pinColor="#2b8a3e"
        />
        {/* Polyline for best route */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#40189D"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
