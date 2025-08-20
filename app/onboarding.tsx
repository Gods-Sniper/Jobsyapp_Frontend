import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';


const onboarding = () => {
  const router = useRouter();

  return (
    
      <View style={styles.container}>
        <Image
          source={require('../assets/images/image.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Explore quick service provided
          </Text>
          <Text style={styles.titleBold}>
            to you in your area
          </Text>
          <Text style={styles.subtitle}>
            Here, you will be able of getting services{'\n'}provided to you
          </Text>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.circleButton}
          >
            <Image
              source={require('../assets/images/btnPrev.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <View style={styles.pagination}>
            <View style={styles.activeDot} />
            <View style={styles.inactiveDot} />
          </View>
          <TouchableOpacity
            style={styles.circleButtonFilled}
            onPress={() => router.push('/onboarding2')}
          >
            <Image
              source={require('../assets/images/btnGetStarted.png')}
              style={styles.arrowIconWhite}
            />
          </TouchableOpacity>
        </View>
      </View>
    
  );
};

export default onboarding;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#FBF6FF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 24,
    height: '100%',
  },
  image: {
    width: 400,
    height: 400,
    marginTop: 20,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 22,
    color: '#40189D',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleBold: {
    fontSize: 22,
    color: '#40189D',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B6B6B',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  circleButtonFilled: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#40189D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    width: 24,
    height: 24,
    tintColor: '#40189D',
  },
  arrowIconWhite: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeDot: {
    width: 32,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#40189D',
    marginHorizontal: 2,
  },
  inactiveDot: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 2,
  },
});