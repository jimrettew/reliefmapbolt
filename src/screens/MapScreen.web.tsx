import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { translateData } from '../utils/translateData';
import { MdMedicalServices, MdHotel, MdFastfood, MdCheckroom, MdPets, MdLocalShipping, MdWifi, MdLocalLaundryService, MdDirectionsCar, MdDirectionsBus, MdInfo, MdLocalFireDepartment, MdWaves, MdAir, MdFilterList, MdClose } from 'react-icons/md';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
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
    center: { lat: 34.15, lng: -118.35 },
    zoom: 10,
  },
  'maui-fires': {
    center: { lat: 20.87, lng: -156.47 },
    zoom: 10,
  },
  'asheville-floods': {
    center: { lat: 35.5951, lng: -82.5515 },
    zoom: 12,
  },
  'hurricane-milton': {
    center: { lat: 27.9758, lng: -82.5400 },
    zoom: 10,
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

const categoryMarkerIcons: Record<string, string> = {
  Animals: '/map-icons/AnimalsIcon.svg',
  Clothes: '/map-icons/ClothesIcon.svg',
  Health: '/map-icons/HealthIcon.svg',
  Information: '/map-icons/InfoIcon.svg',
  Insurance: '/map-icons/InsuranceIcon.svg',
  Laundry: '/map-icons/LaundryIcon.svg',
  Supplies: '/map-icons/SuppliesIcon.svg',
  Transportation: '/map-icons/TransportationIcon.svg',
  'Wifi/Charging': '/map-icons/WifiIcon.svg',
  Shelter: '/map-icons/ShelterIcon.svg',
  Food: '/map-icons/FoodIcon.svg',
};

const getMarkerIcon = (category: string) => {
  if (categoryMarkerIcons[category]) {
    if (window.google && window.google.maps && window.google.maps.Size) {
      return {
        url: categoryMarkerIcons[category],
        scaledSize: new window.google.maps.Size(40, 40),
      };
    }
    return categoryMarkerIcons[category];
  }
  return undefined;
};

const getWebCategoryIcon = (icon: string, color: string, size: number) => {
  const style = { color, fontSize: size };
  if (icon === 'medical-bag') {return <MdMedicalServices style={style} />;}
  if (icon === 'bed') {return <MdHotel style={style} />;}
  if (icon === 'food') {return <MdFastfood style={style} />;}
  if (icon === 'tshirt-crew') {return <MdCheckroom style={style} />;}
  if (icon === 'paw') {return <MdPets style={style} />;}
  if (icon === 'package-variant') {return <MdLocalShipping style={style} />;}
  if (icon === 'wifi') {return <MdWifi style={style} />;}
  if (icon === 'washing-machine') {return <MdLocalLaundryService style={style} />;}
  if (icon === 'car') {return <MdDirectionsCar style={style} />;}
  if (icon === 'bus') {return <MdDirectionsBus style={style} />;}
  if (icon === 'information') {return <MdInfo style={style} />;}
  if (icon === 'fire') {return <MdLocalFireDepartment style={style} />;}
  if (icon === 'waves') {return <MdWaves style={style} />;}
  if (icon === 'weather-windy') {return <MdAir style={style} />;}
  return <MdInfo style={style} />;
};

const isMobile = typeof window !== 'undefined' && window.innerWidth < 500;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#f94b6c',
    padding: 16,
    paddingTop: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: isMobile ? 16 : 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterButton: {
    position: 'absolute',
    top: 24,
    right: 100,
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
  },
  filterMenu: {
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
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
  },
  mapContainer: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#e0e0e0',
  },
  mapStyle: {
    width: '100%',
    height: '100%',
  },
  pinsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  pinsListTitle: {
    fontSize: isMobile ? 14 : 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  pinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pinIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pinContent: {
    flex: 1,
  },
  pinTitle: {
    fontSize: isMobile ? 13 : 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pinLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  pinCategory: {
    fontSize: 12,
    color: '#888',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  selectDisasterButton: {
    backgroundColor: '#f94b6c',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectDisasterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
  },
});

const MapScreen = () => {
  const { selectedDisaster, language, setActiveTab } = useAppContext();
  const { t } = useTranslation();

  const pins = selectedDisaster ? disasterDataMap[selectedDisaster] || [] : [];
  const initialRegion = selectedDisaster ? disasterMapRegion[selectedDisaster] : undefined;

  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPin, setSelectedPin] = useState<any | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalAnimationClass, setModalAnimationClass] = useState('');

  const filteredPins =
    selectedCategories.length === 0
      ? pins
      : pins.filter(pin => selectedCategories.includes(pin.category));

  const onMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  const onLoadScriptError = useCallback((error: any) => {
    console.error('LoadScript error:', error);
  }, []);

  const onMarkerClick = useCallback((pin: any) => {
    setSelectedPin(pin);
  }, []);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const detailScrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    if (showDetailModal) {
      // Animate in
      setModalAnimationClass('modal-enter');
      setTimeout(() => {
        detailScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [showDetailModal]);

  const closeModal = () => {
    setModalAnimationClass('modal-exit');
    setTimeout(() => {
      setShowDetailModal(false);
      setSelectedPin(null);
      setModalAnimationClass('');
    }, 300);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!selectedDisaster || !disasterDataMap[selectedDisaster]) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{t('map')}</Text>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            {t('noDisasterSelected')}
          </Text>
          <TouchableOpacity 
            style={styles.selectDisasterButton}
            onPress={() => setActiveTab('Home')}
          >
            <Text style={styles.selectDisasterText}>
              {t('clickDisasterTabFirst')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{t('map')}</Text>
      </View>

      <View style={styles.content}>
        {/* Google Map */}
        <div style={{ 
          width: '100%',
          height: '60vh',
          borderRadius: 12,
          overflow: 'hidden',
          marginBottom: 16,
          backgroundColor: '#e0e0e0',
        }}>
          {!apiKey && (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0',
              borderRadius: 12,
            }}>
              <Text style={{ color: '#666', textAlign: 'center' }}>
                Google Maps API key not found.{'\n'}
                Please check your .env file.
              </Text>
            </View>
          )}
          {apiKey && (
            <>
              {!mapLoaded && (
                <View style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  zIndex: 10,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 12,
                }}>
                  <Text style={{ color: '#666', textAlign: 'center' }}>
                    Loading Google Maps...
                  </Text>
                </View>
              )}
              <LoadScript
                googleMapsApiKey={apiKey}
                onError={onLoadScriptError}
              >
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={initialRegion?.center}
                  zoom={initialRegion?.zoom || 10}
                  onLoad={onMapLoad}
                  options={{
                    styles: [
                      {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }],
                      },
                    ],
                  }}
                >
                  {filteredPins.map((pin, index) => (
                    <Marker
                      key={index}
                      position={{ lat: pin.latitude, lng: pin.longitude }}
                      onClick={() => { onMarkerClick(pin); setShowDetailModal(false); }}
                      icon={getMarkerIcon(pin.category)}
                    />
                  ))}

                  {selectedPin && !showDetailModal && (
                    <InfoWindow
                      position={{ lat: selectedPin.latitude, lng: selectedPin.longitude }}
                      onCloseClick={() => setSelectedPin(null)}
                    >
                                              <div style={{ minWidth: 180 }}>
                        <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{translateData(selectedPin.organization || selectedPin.title || selectedPin.location, language)}</div>
                        <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{translateData(selectedPin.location, language)}</div>
                        <button
                          style={{
                            backgroundColor: '#f94b6c',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            padding: '8px 12px',
                            fontSize: 14,
                            fontWeight: 'bold',
                            cursor: 'pointer',
                          }}
                          onClick={() => setShowDetailModal(true)}
                        >
                          {t('viewDetails')}
                        </button>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </>
          )}
        </div>

        {/* Filter Button */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterMenuVisible(!filterMenuVisible)}
        >
          <MdFilterList size={isMobile ? 22 : 42} color="#fff" />
        </TouchableOpacity>

        {/* Filter Menu */}
        {filterMenuVisible && (
          <View style={styles.filterMenu}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#f94b6c', marginBottom: 12, textAlign: 'center' }}>{t('filter')}</Text>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => {
                setSelectedCategories([]);
                setFilterMenuVisible(false);
              }}
            >
              <MdInfo size={22} color="#888" />
              <Text style={[styles.filterText, { fontWeight: selectedCategories.length === 0 ? 'bold' : 'normal' }]}>
                {t('all')}
              </Text>
            </TouchableOpacity>

            {Object.keys(categoryStyles).map(cat => {
              const style = categoryStyles[cat] || { color: '#888', icon: 'filter' };
              const isSelected = selectedCategories.includes(cat);
              return (
                <TouchableOpacity
                  key={cat}
                  style={styles.filterItem}
                  onPress={() => {
                    setSelectedCategories(prev =>
                      prev.includes(cat)
                        ? prev.filter(c => c !== cat)
                        : [...prev, cat]
                    );
                  }}
                >
                  {cat === 'Shelter' ? (
                    <img src={categoryMarkerIcons.Shelter} width={22} height={22} alt={cat} style={{ borderRadius: '50%', background: style.color }} />
                  ) : (
                    getWebCategoryIcon(style.icon, style.color, 22)
                  )}
                  <Text style={[styles.filterText, {
                    fontWeight: isSelected ? 'bold' : 'normal',
                    color: style.color,
                  }]}>
                    {cat}
                  </Text>
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

        {/* Pins List */}
        <View style={styles.pinsList}>
          <Text style={styles.pinsListTitle}>
            {t('locations')} ({filteredPins.length})
          </Text>

          <ScrollView style={{ maxHeight: 300 }}>
            {filteredPins.map((pin, index) => (
              <TouchableOpacity
                key={index}
                style={styles.pinItem}
                onPress={() => setSelectedPin(pin)}
              >
                <View style={[
                  styles.pinIcon,
                  { backgroundColor: categoryStyles[pin.category]?.color || '#666' },
                ]}>
                  {getWebCategoryIcon(
                    categoryStyles[pin.category]?.icon || 'map-marker',
                    '#fff',
                    20
                  )}
                </View>

                <View style={styles.pinContent}>
                  <Text style={styles.pinTitle}>
                    {translateData(pin.organization || pin.title, language)}
                  </Text>
                  <Text style={styles.pinLocation}>
                    {translateData(pin.location, language)}
                  </Text>
                  <Text style={styles.pinCategory}>
                    {translateData(pin.category, language)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Pin Detail Modal */}
      {showDetailModal && selectedPin && (
        <>
          <style>
            {`
              @keyframes modalSlideUp {
                from {
                  transform: translateY(100%);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
              
              @keyframes modalSlideDown {
                from {
                  transform: translateY(0);
                  opacity: 1;
                }
                to {
                  transform: translateY(100%);
                  opacity: 0;
                }
              }
              
              @keyframes overlayFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              
              @keyframes overlayFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
              }
              
              .modal-enter .modal-overlay {
                animation: overlayFadeIn 0.3s ease-out forwards;
              }
              
              .modal-enter .modal-content {
                animation: modalSlideUp 0.3s ease-out forwards;
              }
              
              .modal-exit .modal-overlay {
                animation: overlayFadeOut 0.3s ease-out forwards;
              }
              
              .modal-exit .modal-content {
                animation: modalSlideDown 0.3s ease-out forwards;
              }
            `}
          </style>
          <div className={modalAnimationClass}>
            <div 
              className="modal-overlay"
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'flex-end',
                flexDirection: 'column',
                zIndex: 1001,
              }}
              onClick={closeModal}
            >
              <div 
                className="modal-content"
                style={{
                  backgroundColor: '#fff',
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  position: 'relative',
                  width: '100%',
                  maxHeight: '85vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 10,
                    backgroundColor: '#eee',
                    borderRadius: 16,
                    width: 32,
                    height: 32,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                  }}
                  onClick={closeModal}
                >
                  <MdClose size={20} color="#333" />
                </button>
                <div style={{ 
                  flexGrow: 1, 
                  overflowY: 'auto', 
                  overflowX: 'hidden',
                  padding: 24,
                  paddingTop: 48,
                  paddingBottom: 100,
                  maxHeight: 'calc(85vh - 24px)',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                  <View style={[
                    styles.pinIcon,
                    {
                      backgroundColor: categoryStyles[selectedPin.category]?.color || '#ccc',
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      marginBottom: 12,
                    },
                  ]}>
                    {getWebCategoryIcon(
                      categoryStyles[selectedPin.category]?.icon || 'map-marker',
                      '#fff',
                      28
                    )}
                  </View>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 4 }}>
                    {translateData(selectedPin.organization || selectedPin.title || selectedPin.location, language)}
                  </Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                  <Text style={styles.detailLabel}>{t('address')}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const address = encodeURIComponent(selectedPin.address || selectedPin.location);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                    }}
                  >
                    <Text style={[styles.detailValue, { color: '#f94b6c', textDecorationLine: 'underline' }]}>
                      {selectedPin.address || selectedPin.location}
                    </Text>
                  </TouchableOpacity>
                </View>

                {selectedPin.category && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, color: '#444', marginBottom: 6, wordWrap: 'break-word', whiteSpace: 'pre-wrap' } as any}>
                      <Text style={{ fontWeight: 'bold' }}>{t('category')}: </Text>
                      {translateData(selectedPin.category, language)}
                    </Text>
                  </View>
                )}

                {selectedPin.providing && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, color: '#444', marginBottom: 6, wordWrap: 'break-word', whiteSpace: 'pre-wrap' } as any}>
                      <Text style={{ fontWeight: 'bold' }}>{t('providing')}: </Text>
                      {translateData(selectedPin.providing, language)}
                    </Text>
                  </View>
                )}

                {selectedPin.needs && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, color: '#444', marginBottom: 6, wordWrap: 'break-word', whiteSpace: 'pre-wrap' } as any}>
                      <Text style={{ fontWeight: 'bold' }}>{t('needs')}: </Text>
                      {translateData(selectedPin.needs, language)}
                    </Text>
                  </View>
                )}

                {selectedPin.hours && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, color: '#444', marginBottom: 6, wordWrap: 'break-word', whiteSpace: 'pre-wrap' } as any}>
                      <Text style={{ fontWeight: 'bold' }}>{t('hours')}: </Text>
                      {translateData(selectedPin.hours, language)}
                    </Text>
                  </View>
                )}

                {selectedPin.contact &&
                  selectedPin.contact.trim() !== '' &&
                  selectedPin.contact.trim().toLowerCase() !== 'na' &&
                  selectedPin.contact.trim().toLowerCase() !== 'n/a' && (
                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, color: '#444', marginBottom: 6, wordWrap: 'break-word', whiteSpace: 'pre-wrap' } as any}>
                      <Text style={{ fontWeight: 'bold' }}>{t('contact')}: </Text>
                      {selectedPin.contact}
                    </Text>
                  </View>
                )}

                <FacilityRating facilityId={selectedPin.id} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </View>
  );
};

export default MapScreen;
