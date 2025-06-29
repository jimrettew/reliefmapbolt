import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable, ScrollView, Animated, Linking, ActivityIndicator } from 'react-native';
import MapView, { Marker as NativeMarker } from 'react-native-maps';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { translateData } from '../utils/translateData';
import FacilityRating from '../components/FacilityRating';


import laFiresData from '../../assets/la-fires.json';
import mauiFireData from '../../assets/maui-fire.json';
import ashevilleFloodsData from '../../assets/asheville-floods.json';
import hurricaneMiltonData from '../../assets/hurricane-milton.json';

const disasterDataMap: Record<string, any[]> = {
  'la-fires': laFiresData,
  'maui-fires': mauiFireData,
  'asheville-floods': ashevilleFloodsData,
  'hurricane-milton': hurricaneMiltonData,
};

const disasterMapRegion: Record<string, any> = {
  'la-fires': {
    latitude: 34.12,
    longitude: -118.35,
    latitudeDelta: 0.5,
    longitudeDelta: 1.2,
  },
  'maui-fires': {
    latitude: 20.87,
    longitude: -156.47,
    latitudeDelta: 0.4,
    longitudeDelta: 0.5,
  },
  'asheville-floods': {
    latitude: 35.5951,
    longitude: -82.5515,
    latitudeDelta: 0.08,
    longitudeDelta: 0.1,
  },
  'hurricane-milton': {
    latitude: 27.95,
    longitude: -82.46,
    latitudeDelta: 0.4,
    longitudeDelta: 0.5,
  },
};

const categoryStyles: Record<string, { color: string; icon: string }> = {
  Health: { color: '#880e4f', icon: 'medical-bag' },
  Shelter: { color: '#b71c1c', icon: 'bed' },
  Food: { color: '#ff5e5e', icon: 'food' },
  Clothes: { color: '#ff9800', icon: 'tshirt-crew' },
  Animals: { color: '#ffd600', icon: 'paw' },
  Supplies: { color: '#0097a7', icon: 'package-variant' },
  'Wifi/Charging': { color: '#039be5', icon: 'wifi' },
  Laundry: { color: '#9c27b0', icon: 'washing-machine' },
  Insurance: { color: '#795548', icon: 'car' },
  Transportation: { color: '#757575', icon: 'bus' },
  Information: { color: '#424242', icon: 'information' },
};

const styles = StyleSheet.create({
  zoomControls: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    flexDirection: 'column',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    padding: 4,
  },
  zoomButton: {
    padding: 10,
    alignItems: 'center',
  },
  zoomText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

const circleStyles = StyleSheet.create({
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});



const MapScreen = () => {
  const { selectedDisaster, language, setActiveTab } = useAppContext();
  const { t } = useTranslation();

  const pins = useMemo(() => {
    return selectedDisaster ? disasterDataMap[selectedDisaster] || [] : [];
  }, [selectedDisaster]);

  const initialRegion = selectedDisaster ? disasterMapRegion[selectedDisaster] : undefined;

  const mapRef = useRef<any>(null);

  const [mapLoading, setMapLoading] = useState(true);

  const currentRegionRef = useRef(initialRegion);

  const zoom = (factor: number) => {
    if (mapRef.current && currentRegionRef.current) {
      const newRegion = {
        ...currentRegionRef.current,
        latitudeDelta: currentRegionRef.current.latitudeDelta * factor,
        longitudeDelta: currentRegionRef.current.longitudeDelta * factor,
      };
      mapRef.current.animateToRegion(newRegion, 300);
      currentRegionRef.current = newRegion;
    }
  };

  const validatedPins = pins;



  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const filteredPins =
    selectedCategories.length === 0
      ? validatedPins
      : validatedPins.filter(pin => selectedCategories.includes(pin.category));



  const [selectedPin, setSelectedPin] = useState<any | null>(null);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(400)).current; // Start off-screen

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (selectedPin) {
      setModalVisible(true);
      // Animate in
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (modalVisible) {
      // Animate out
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(cardTranslateY, {
        toValue: 400,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [selectedPin, modalVisible, overlayOpacity, cardTranslateY]);

  useEffect(() => {
    currentRegionRef.current = initialRegion;
    if (mapRef.current && initialRegion) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  }, [initialRegion]);



  const renderNativeMap = () => (
    <MapView
        key={selectedDisaster}
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={initialRegion}
        onRegionChangeComplete={(region) => {
          currentRegionRef.current = region;
        }}
        onMapReady={() => {
          setMapLoading(false);
        }}
      >
        {filteredPins.map((pin, index) => (
          <NativeMarker
            key={`${pin.latitude}-${pin.longitude}-${index}`}
            coordinate={{
              latitude: pin.latitude,
              longitude: pin.longitude,
            }}
            onPress={() => setSelectedPin(pin)}
          >
            <View style={[circleStyles.iconCircle, { backgroundColor: categoryStyles[pin.category]?.color || '#666' }]}>
              <MaterialCommunityIcons
                name={categoryStyles[pin.category]?.icon || 'map-marker'}
                size={20}
                color="#fff"
              />
            </View>
          </NativeMarker>
        ))}
      </MapView>
  );

  if (!selectedDisaster || !disasterDataMap[selectedDisaster]) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 20, color: '#666' }}>
          {t('noDisasterSelected')}
        </Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#f94b6c', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}
          onPress={() => setActiveTab('Home')}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            {t('clickDisasterTabFirst')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {mapLoading && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backgroundColor: 'rgba(255,255,255,0.7)',
        }}>
          <ActivityIndicator size="large" color="#f94b6c" />
        </View>
      )}

      {/* Floating Filter Button */}
      <TouchableOpacity
        onPress={() => setFilterMenuVisible(true)}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 100,
          backgroundColor: '#f94b6c',
          borderRadius: 32,
          width: 64,
          height: 64,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 6,
        }}
      >
        <MaterialCommunityIcons name="filter-variant" size={28} color="#fff" />
      </TouchableOpacity>

      {renderNativeMap()}

      {/* Zoom controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={() => zoom(0.5)}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={() => zoom(2)}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>
      {filterMenuVisible && (
        <View style={{
          position: 'absolute',
          top: 60,
          right: 16,
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 12,
          shadowColor: '#000',
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
          zIndex: 100,
          minWidth: 180,
        }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
            onPress={() => {
              setSelectedCategories([]); // All
              setFilterMenuVisible(false);
            }}
          >
            <MaterialCommunityIcons name="select-all" size={22} color="#888" style={{ marginRight: 8 }} />
            <Text style={{ fontWeight: selectedCategories.length === 0 ? 'bold' : 'normal' }}>{t('all')}</Text>
          </TouchableOpacity>
          {Object.keys(categoryStyles).map(cat => {
            const style = categoryStyles[cat] || { color: '#888', icon: 'filter' };
            const isSelected = selectedCategories.includes(cat);
            return (
              <TouchableOpacity
                key={cat}
                style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
                onPress={() => {
                  setSelectedCategories(prev =>
                    prev.includes(cat)
                      ? prev.filter(c => c !== cat)
                      : [...prev, cat]
                  );
                }}
              >
                <MaterialCommunityIcons name={style.icon} size={22} color={style.color} style={{ marginRight: 8 }} />
                <Text style={{ fontWeight: isSelected ? 'bold' : 'normal', color: style.color }}>{cat}</Text>
                {isSelected && <MaterialCommunityIcons name="check" size={18} color="#4caf50" style={{ marginLeft: 6 }} />}
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            onPress={() => setFilterMenuVisible(false)}
            style={{ alignSelf: 'flex-end', marginTop: 4 }}
          >
            <Text style={{ color: '#f94b6c', fontWeight: 'bold' }}>{t('done')}</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* Detail Card Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={() => setSelectedPin(null)}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            opacity: overlayOpacity,
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            justifyContent: 'flex-end',
          }}
          pointerEvents={selectedPin ? 'auto' : 'none'}
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setSelectedPin(null)}
          />
          <Animated.View
            style={{
              transform: [{ translateY: cardTranslateY }],
            }}
          >
            <Pressable
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 24,
                minHeight: 280,
                elevation: 10,
              }}
              onPress={() => {}}
            >
              {selectedPin && (
                <ScrollView>
                  <View style={{ alignItems: 'center', marginBottom: 12 }}>
                    <View style={[circleStyles.iconCircle, { backgroundColor: categoryStyles[selectedPin.category]?.color || '#ccc', marginBottom: 8 }]}>
                      <MaterialCommunityIcons name={categoryStyles[selectedPin.category]?.icon || 'map-marker'} size={28} color="#fff" />
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', marginBottom: 4 }}>{translateData(selectedPin.organization || selectedPin.title || selectedPin.location, language)}</Text>
                    <Text style={{ fontSize: 16, color: '#888', marginBottom: 8 }}>{translateData(selectedPin.location, language)}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPin.address)}`;
                      Linking.openURL(url);
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#1a73e8', marginBottom: 10, textDecorationLine: 'underline' }}>
                      <Text style={{ fontWeight: 'bold', color: '#444' }}>{t('address')} </Text>
                      {selectedPin.address}
                    </Text>
                  </TouchableOpacity>
                  {selectedPin.category && (
                    <Text style={{ fontSize: 16, color: '#444', marginBottom: 10 }}>
                      <Text style={{ fontWeight: 'bold' }}>{t('category')} </Text>
                      {translateData(selectedPin.category, language)}
                    </Text>
                  )}
                  {selectedPin.providing && (
                    <Text style={{ fontSize: 16, color: '#444', marginBottom: 10 }}>
                      <Text style={{ fontWeight: 'bold' }}>{t('providing')} </Text>
                      {translateData(selectedPin.providing, language)}
                    </Text>
                  )}
                  {selectedPin.needs && (
                    <Text style={{ fontSize: 16, color: '#444', marginBottom: 10 }}>
                      <Text style={{ fontWeight: 'bold' }}>{t('needs')} </Text>
                      {translateData(selectedPin.needs, language)}
                    </Text>
                  )}
                  {selectedPin.hours && (
                    <Text style={{ fontSize: 16, color: '#444', marginBottom: 10 }}>
                      <Text style={{ fontWeight: 'bold' }}>{t('hours')} </Text>
                      {translateData(selectedPin.hours, language)}
                    </Text>
                  )}
                  {selectedPin.contact &&
                    selectedPin.contact.trim() !== '' &&
                    selectedPin.contact.trim().toLowerCase() !== 'na' &&
                    selectedPin.contact.trim().toLowerCase() !== 'n/a' ? (
                      <TouchableOpacity
                        onPress={() => {
                          const phone = selectedPin.contact.replace(/[^0-9+]/g, ''); // Clean up the number
                          Linking.openURL(`tel:${phone}`);
                        }}
                      >
                        <Text style={{ fontSize: 16, color: '#1a73e8', marginBottom: 10, textDecorationLine: 'underline' }}>
                          <Text style={{ fontWeight: 'bold', color: '#444' }}>{t('contact')} </Text>
                          {selectedPin.contact}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      selectedPin.contact && selectedPin.contact.trim() !== '' && (
                        <Text style={{ fontSize: 16, color: '#444', marginBottom: 10 }}>
                          <Text style={{ fontWeight: 'bold' }}>{t('contact')} </Text>
                          {selectedPin.contact}
                        </Text>
                      )
                    )
                  }
                  <FacilityRating facilityId={`${selectedPin.latitude}-${selectedPin.longitude}-${selectedPin.organization || selectedPin.title || 'facility'}`} />
                  <TouchableOpacity
                    style={{
                      marginTop: 18,
                      backgroundColor: '#f94b6c',
                      borderRadius: 10,
                      paddingVertical: 12,
                      alignItems: 'center',
                    }}
                    onPress={() => setSelectedPin(null)}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{t('close')}</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

export default MapScreen;
