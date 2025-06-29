import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useTranslatedData } from '../utils/translateData';

import { useApiCall } from '../hooks/useApiCall';
import { logError } from '../utils/errorHandler';
import newsDataEn from '../../assets/news.json';
import newsDataEs from '../../assets/news.es.json';

const disasterDisplayNames: Record<string, { en: string; es: string }> = {
  'la-fires': { en: 'LA Fires 2025', es: 'Incendios de LA 2025' },
  'maui-fires': { en: 'Maui Wildfire 2024', es: 'Incendio de Maui 2024' },
  'asheville-floods': { en: 'Asheville NC Flood 2024', es: 'Inundación Asheville NC 2024' },
  'hurricane-milton': { en: 'Hurricane Milton 2024', es: 'Huracán Milton 2024' },
};

const NewsScreen = () => {
  const { selectedDisaster, language, theme } = useAppContext();
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(false);
  const [newsData, setNewsData] = useState(language === 'es' ? newsDataEs : newsDataEn);

  const isDark = theme === 'dark';

  const fetchNewsData = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const data = language === 'es' ? newsDataEs : newsDataEn;
      setNewsData(data);
      return data;
    } catch (error) {
      logError(error as Error, undefined, { component: 'NewsScreen', action: 'fetchNewsData' });
      throw error;
    }
  }, [language]);

  const { loading, execute: retryFetch } = useApiCall(fetchNewsData, newsData);

  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        await fetch('https://www.google.com', {
          method: 'HEAD',
          mode: 'no-cors',
        });
        setIsOffline(false);
      } catch {
        setIsOffline(true);
      }
    };

    checkConnectivity();
    const interval = setInterval(checkConnectivity, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLinkPress = useCallback(async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      logError(error as Error, undefined, { component: 'NewsScreen', action: 'handleLinkPress', url });
      Alert.alert('Error', 'Failed to open link');
    }
  }, []);

  const filteredNews = newsData.filter((item: any) => {
    if (!selectedDisaster) {return true;}
    const displayName = disasterDisplayNames[selectedDisaster][language];
    return item.Disaster === displayName;
  });

  const translatedNews = useTranslatedData(filteredNews);

  const renderCard = ({ item }: { item: any }) => {
    const displayDate = new Date(item.Date).toLocaleDateString(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return (
      <View style={[styles.card, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.timestamp, { color: isDark ? '#999' : '#888' }]}>{displayDate}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.Source}</Text>
          </View>
        </View>
        <Text style={[styles.headline, { color: isDark ? '#fff' : '#000' }]}>{item.Headline}</Text>
        <Text style={[styles.body, { color: isDark ? '#ccc' : '#444' }]}>{item.Summary}</Text>
        <TouchableOpacity onPress={() => handleLinkPress(item.Url || 'https://example.com')}>
          <Text style={styles.link}>{t('readFullUpdate')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handleRetry = useCallback(async () => {
    try {
      await retryFetch();
    } catch (error) {
      console.error('News retry failed:', error);
    }
  }, [retryFetch]);

  return (
    <FlatList
        data={translatedNews}
        renderItem={renderCard}
        keyExtractor={(_, idx) => idx.toString()}
        style={{ backgroundColor: isDark ? '#000' : '#fff' }}
        ListHeaderComponent={
          <View style={[styles.headerContainer, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <Text style={[styles.title, { color: isDark ? '#fff' : '#222' }]}>{t('newsTitle')}</Text>
            <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#666' }]}>{t('newsSubtitle')}</Text>
            {isOffline && (
              <View style={[styles.offlineBanner, { backgroundColor: isDark ? '#2c2c2e' : '#f0f0f0' }]}>
                <Text style={[styles.offlineText, { color: isDark ? '#999' : '#666' }]}>{t('offlineMode')} - {t('showingCachedData')}</Text>
              </View>
            )}
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={true}
        refreshing={loading}
        onRefresh={handleRetry}
      />
  );
};

const styles = StyleSheet.create({
  headerContainer: { paddingTop: 24, paddingBottom: 0 },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginLeft: 20, marginBottom: 2, fontFamily: 'System' },
  subtitle: { fontSize: 16, marginLeft: 20, marginBottom: 16, fontFamily: 'System' },
  picker: { marginBottom: 16 },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  timestamp: { fontSize: 12, fontFamily: 'System', flexShrink: 1, marginRight: 8 },
  badge: { backgroundColor: '#fcc4cc', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2 },
  badgeText: { color: '#b71c1c', fontWeight: 'bold', fontSize: 12, fontFamily: 'System' },
  headline: { fontSize: 18, fontWeight: 'bold', marginTop: 8, fontFamily: 'System' },
  body: { marginTop: 4, fontFamily: 'System' },
  link: { color: '#5ea1fa', marginTop: 8, fontWeight: 'bold', fontFamily: 'System' },
  offlineBanner: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  offlineText: { fontSize: 12, fontFamily: 'System' },
});

export default NewsScreen;
