import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAppContext } from '../context/AppContext';

import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const disasters = [
  {
    id: 'la-fires',
    title: 'LA Fires',
    subtitle: 'Los Angeles County',
    icon: 'fire',
    iconColor: '#f94b6c',
    resourceCount: 20,
  },
  {
    id: 'maui-fires',
    title: 'Maui Fire',
    subtitle: 'Hawaii',
    icon: 'fire',
    iconColor: '#f94b6c',
    resourceCount: 14,
  },
  {
    id: 'asheville-floods',
    title: 'Asheville Flood',
    subtitle: 'North Carolina',
    icon: 'waves',
    iconColor: '#f94b6c',
    resourceCount: 14,
  },
  {
    id: 'hurricane-milton',
    title: 'Hurricane Milton',
    subtitle: 'Florida',
    icon: 'weather-windy',
    iconColor: '#f94b6c',
    resourceCount: 12,
  },
];

const HomeScreen = () => {
  const { setSelectedDisaster, setActiveTab, theme } = useAppContext();
  const { t } = useTranslation();

  const isDark = theme === 'dark';

  const handleMapButtonPress = (disasterId: string) => {
    setSelectedDisaster(disasterId as any);
    setActiveTab('Map');
  };

  const renderCard = ({ item }: { item: typeof disasters[0] }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}
      activeOpacity={0.9}
      onPress={() => setSelectedDisaster(item.id as any)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badge}><Text style={styles.badgeText}>{t('active')}</Text></View>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={item.icon} size={28} color={item.iconColor} />
        </View>
      </View>
      <Text style={[styles.cardTitle, { color: isDark ? '#fff' : '#222' }]}>{item.title}</Text>
      <Text style={[styles.cardSubtitle, { color: isDark ? '#ccc' : '#444' }]}>{item.subtitle}</Text>
      <Text style={[styles.resourceCount, { color: isDark ? '#999' : '#888' }]}>{item.resourceCount} {t('resourceLocations')}</Text>
      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => handleMapButtonPress(item.id)}
      >
        <Text style={styles.mapButtonText}>{t('viewMap')}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={disasters}
      renderItem={renderCard}
      keyExtractor={item => item.id}
      style={{ backgroundColor: isDark ? '#000' : '#f7f7f7' }}
      ListHeaderComponent={
        <View style={[styles.headerContainer, { backgroundColor: isDark ? '#000' : '#f7f7f7' }]}>
          <Text style={[styles.pageTitle, { color: isDark ? '#fff' : '#222' }]}>{t('activeDisasters')}</Text>
          <Text style={[styles.pageSubtitle, { color: isDark ? '#ccc' : '#666' }]}>{t('selectDisaster')}</Text>
        </View>
      }
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={true}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: { paddingTop: 24, paddingBottom: 0 },
  container: { flex: 1, paddingHorizontal: 0, paddingTop: 24 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', marginLeft: 20, marginBottom: 2, fontFamily: 'System' },
  pageSubtitle: { fontSize: 16, marginLeft: 20, marginBottom: 16, fontFamily: 'System' },
  card: {
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  badge: {
    backgroundColor: '#fcc4cc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: { color: '#f94b6c', fontWeight: 'bold', fontSize: 13, fontFamily: 'System' },
  iconCircle: {
    backgroundColor: '#fcc4cc',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 2, fontFamily: 'System' },
  cardSubtitle: { fontSize: 15, marginBottom: 8, fontFamily: 'System' },
  resourceCount: { fontSize: 14, marginBottom: 12, fontFamily: 'System' },
  mapButton: {
    backgroundColor: '#f94b6c',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  mapButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, fontFamily: 'System' },
});

export default HomeScreen;
