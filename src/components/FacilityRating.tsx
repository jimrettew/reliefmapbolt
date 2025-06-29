import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MdStar, MdStarBorder } from 'react-icons/md';
import { supabase } from '../utils/supabase';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

interface FacilityRatingProps {
  facilityId: string;
}

const FacilityRating = ({ facilityId }: FacilityRatingProps) => {
  const { authStatus, setTargetAuthScreen, setAuthStatus } = useAppContext();
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [userHasRated, setUserHasRated] = useState<boolean>(false);

  useEffect(() => {
    fetchRatings();
  }, [facilityId]);

  const fetchRatings = async () => {
    const { data: ratingData, error: ratingError } = await supabase
      .from('facility_ratings')
      .select('rating, user_id')
      .eq('facility_id', facilityId);

    if (ratingError) {return;}

    if (ratingData && ratingData.length > 0) {
      const avg = ratingData.reduce((acc, curr) => acc + curr.rating, 0) / ratingData.length;
      setAverageRating(avg);
      setTotalRatings(ratingData.length);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const userRating = ratingData.find(r => r.user_id === user.id);
        if (userRating) {
          setRating(userRating.rating);
          setUserHasRated(true);
        } else {
          setRating(0);
          setUserHasRated(false);
        }
      }
    } else {
      setAverageRating(0);
      setTotalRatings(0);
      setUserHasRated(false);
      setRating(0);
    }
  };

  const handleRating = async (value: number) => {
    if (authStatus !== 'signedin' && authStatus !== 'loggedin') {return;}

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {return;}

    const { error } = await supabase
      .from('facility_ratings')
      .upsert([
        {
          facility_id: facilityId,
          user_id: user.id,
          rating: value,
        },
      ], { onConflict: 'facility_id,user_id' });

    if (!error) {
      setRating(value);
      setUserHasRated(true);
      fetchRatings();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('communityRating')}</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(star)}
            disabled={userHasRated || (authStatus !== 'signedin' && authStatus !== 'loggedin')}
          >
            {star <= (userHasRated ? rating : Math.round(averageRating)) ? (
              <MdStar size={24} color="#f94b6c" />
            ) : (
              <MdStarBorder size={24} color="#f94b6c" />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.ratingText}>
        {averageRating ? averageRating.toFixed(1) : t('noRatingsYet')} ({totalRatings} {totalRatings === 1 ? t('rating') : t('ratings')})
      </Text>
      {authStatus === 'guest' && (
        <View style={styles.authLinksContainer}>
          <TouchableOpacity
            onPress={() => {
              setTargetAuthScreen('SignIn');
              setAuthStatus(null);
            }}
          >
            <Text style={styles.signInText}>{t('signInLink')}</Text>
          </TouchableOpacity>
          <Text style={styles.orText}> {t('or')} </Text>
          <TouchableOpacity
            onPress={() => {
              setTargetAuthScreen('Login');
              setAuthStatus(null);
            }}
          >
            <Text style={styles.signInText}>{t('logInLink')}</Text>
          </TouchableOpacity>
          <Text style={styles.suffixText}> {t('signInOrLogInToRate')}</Text>
        </View>
      )}
      {userHasRated && (
        <Text style={styles.ratedText}>{t('thankYouForRating')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    alignItems: 'flex-start',
    marginTop: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    alignSelf: 'flex-start',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  ratingText: {
    color: '#666',
    fontSize: 14,
    alignSelf: 'flex-start',
  },
  authLinksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  signInText: {
    color: '#f94b6c',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  orText: {
    color: '#666',
    fontSize: 14,
  },
  suffixText: {
    color: '#666',
    fontSize: 14,
  },
  ratedText: {
    color: '#f94b6c',
    fontSize: 14,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});

export default FacilityRating;
