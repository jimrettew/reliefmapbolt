import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import NewsScreen from '../screens/NewsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthNavigator from './AuthNavigator';

const TabNavigator = () => {
  const { authStatus, activeTab, setActiveTab, theme } = useAppContext();
  const { t } = useTranslation();

  
  // Native iOS TabNavigator initialized

  // Show auth stack if not authenticated
  if (!authStatus) {
    return <AuthNavigator />;
  }

  const isDark = theme === 'dark';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Map':
        return <MapScreen />;
      case 'News':
        return <NewsScreen />;
      case 'Settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000' : '#f8fafc',
    },
    tabContent: {
      flex: 1,
    },
    tabBar: {
      flexDirection: 'row' as const,
      borderTopWidth: 0,
      minHeight: 70,
      paddingBottom: 8,
      paddingTop: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 10,
    },
    tab: {
      flex: 1,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingVertical: 8,
      paddingHorizontal: 4,
      marginHorizontal: 6,
      borderRadius: 16,
      position: 'relative' as const,
    },
    activeTab: {
      backgroundColor: '#f94b6c',
      shadowColor: '#f94b6c',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    tabLabel: {
      fontSize: 11,
      fontWeight: '600' as const,
      marginTop: 4,
      textAlign: 'center' as const,
    },
    activeTabLabel: {
      color: 'white',
      fontWeight: '700' as const,
    },
  };

  return (
    <SafeAreaView style={dynamicStyles.container} edges={['top', 'left', 'right']}>
      <View style={dynamicStyles.tabContent}>{renderTabContent()}</View>
      <SafeAreaView style={dynamicStyles.tabBar} edges={['bottom', 'left', 'right']}>
        <TouchableOpacity
          style={[dynamicStyles.tab, activeTab === 'Home' && dynamicStyles.activeTab]}
          onPress={() => setActiveTab('Home')}
        >
          <MaterialCommunityIcons
            name="fire"
            size={24}
            color={activeTab === 'Home' ? 'white' : (isDark ? '#8e8e93' : '#64748b')}
          />
          <Text
            style={[dynamicStyles.tabLabel, activeTab === 'Home' && dynamicStyles.activeTabLabel]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}
          >
            {t('disasters')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[dynamicStyles.tab, activeTab === 'Map' && dynamicStyles.activeTab]}
          onPress={() => setActiveTab('Map')}
        >
          <MaterialCommunityIcons
            name="map"
            size={24}
            color={activeTab === 'Map' ? 'white' : (isDark ? '#8e8e93' : '#64748b')}
          />
          <Text
            style={[dynamicStyles.tabLabel, activeTab === 'Map' && dynamicStyles.activeTabLabel]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}
          >
            {t('map')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[dynamicStyles.tab, activeTab === 'News' && dynamicStyles.activeTab]}
          onPress={() => setActiveTab('News')}
        >
          <MaterialCommunityIcons
            name="update"
            size={24}
            color={activeTab === 'News' ? 'white' : (isDark ? '#8e8e93' : '#64748b')}
          />
          <Text
            style={[dynamicStyles.tabLabel, activeTab === 'News' && dynamicStyles.activeTabLabel]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}
          >
            {t('updates')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[dynamicStyles.tab, activeTab === 'Settings' && dynamicStyles.activeTab]}
          onPress={() => setActiveTab('Settings')}
        >
          <MaterialCommunityIcons
            name="cog"
            size={24}
            color={activeTab === 'Settings' ? 'white' : (isDark ? '#8e8e93' : '#64748b')}
          />
          <Text
            style={[dynamicStyles.tabLabel, activeTab === 'Settings' && dynamicStyles.activeTabLabel]}
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.8}
          >
            {t('settings')}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 0,
    minHeight: 70,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 6,
    borderRadius: 16,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#f94b6c',
    shadowColor: '#f94b6c',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: 'white',
    fontWeight: '700',
  },
});

export default TabNavigator;
