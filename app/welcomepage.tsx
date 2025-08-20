import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

const WelcomePage = () => {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <Image
          source={require('../assets/images/logo4.png')}
          style={styles.logo}
        />
        <Text style={styles.logoText}>JobSy</Text>
      </View>
      <View style={styles.contentSection}>
        <Text style={styles.continueAs}>Continue as</Text>
        <Text style={styles.subtitle}>Ready to start this experience{'\n'}with us ?</Text>
        <View style={styles.options}>
          <Pressable
            style={({ pressed }) => [
              styles.optionBox,
              pressed && styles.optionBoxPressed,
            ]}
            onPress={() => router.push('/login')}
          >
            <View style={styles.optionRow} >
              <Image
                source={require('../assets/images/jobseekerimg.png')}
                style={styles.optionIcon}
              />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>JOB SEEKER</Text>
                <Text style={styles.optionDesc}>
                  Finding a job here never{'\n'}been easier than before
                </Text>
              </View>
            </View>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.optionBox,
              pressed && styles.optionBoxPressed,
            ]}
            onPress={() => router.push('/login')}
          >
            <View style={styles.optionRow}>
              <Image
                source={require('../assets/images/jobproviderimg.png')}
                style={styles.optionIcon}
              />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>JOB PROVIDER</Text>
                <Text style={styles.optionDesc}>
                  Let’s recruit your great{'\n'}candidate faster here
                </Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default WelcomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F3FF',
    alignItems: 'center',
    paddingTop: 60,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#40189D',
    fontFamily: 'Poppins bold-italic',
    
  },
  contentSection: {
    width: '100%',
    alignItems: 'center',
  },
  continueAs: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#505050ff',
    marginBottom: 18,
    alignSelf: 'flex-start',
    marginLeft: 40,
  },
  options: {
    width: '100%',
    alignItems: 'center',
  },
  optionBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    width: '85%',
    shadowColor: '#40189D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  optionBoxPressed: {
    backgroundColor: '#ECE6F6',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    color: '#40189D',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  optionDesc: {
    color: '#6B6B6B',
    fontSize: 14,
    lineHeight: 20,
  },
});