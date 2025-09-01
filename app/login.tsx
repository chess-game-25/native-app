import { AuthContext } from "@/utils/authContext";
import { SplashScreen, Stack } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useFonts } from 'expo-font'; 
import axios from "axios";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const authContext = useContext(AuthContext);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const BACKEND_URL = `http://${process.env.EXPO_PUBLIC_BACKEND_SERVER_IP}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`;
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'MerriweatherBold': require('../assets/fonts/Merriweather-Bold.ttf'),
    'MerriweatherRegular': require('../assets/fonts/Merriweather-Regular.ttf'),
  });

  useEffect(() => {
    if (authContext.isReady && fontsLoaded) SplashScreen.hideAsync();
  }, [authContext.isReady, fontsLoaded]);

  const handleSendOtp = async () => {
    setSendingOtp(true);
    setError('');
    try{
        const response = await axios.post(`${BACKEND_URL}/api/auth/initiate_login`, { phoneNumber });
        if (response.status === 200) {
            setStep('otp');
            Toast.show({
                type: 'appSuccess',
                text1: 'Success',
                text2: 'OTP sent successfully',
                position: 'top',
                visibilityTime: 4000,
            });
        } else {
            Toast.show({
            type: 'appError',
            text1: 'Error',
            text2: 'Failed to send OTP',
            position: 'top',
            });
        }
    }catch(err){
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to send OTP',
            position: 'top',
        });
    }finally{
        setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    setError('');
    try {
        const response = await axios.post(`${BACKEND_URL}/api/auth/initiate_request`, { phoneNumber });
        if (response.status === 200) {
            setStep('otp');
            Toast.show({
                type: 'appSuccess',
                text1: 'Success',
                text2: 'OTP resent successfully',
                position: 'top',
                visibilityTime: 4000,
            });
        } else {
            Toast.show({
                type: 'appError',
                text1: 'Error',
                text2: 'Failed to resend OTP',
                position: 'top',
                visibilityTime: 4000,
            });
        }
    } catch (err) {
        Toast.show({
            type: 'appError',
            text1: 'Error',
            text2: 'Failed to resend OTP',
            position: 'top',
            visibilityTime: 4000,
        });
    } finally {
        setResending(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    await authContext.logIn(phoneNumber, otp);
    setSubmitting(false);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <ImageBackground
        source={require('../assets/images/chess_board_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.container}>

          <Text style={styles.title}>Login</Text>
          {step === 'phone' ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={15}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleSendOtp}
                disabled={sendingOtp || !phoneNumber}
              >
                <Text style={styles.buttonText}>{sendingOtp ? 'Sending...' : 'Send OTP'}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.otpInfo}>OTP sent to <Text style={styles.bold}>{phoneNumber}</Text></Text>
              <TouchableOpacity style={styles.editPhoneBtn} onPress={() => setStep('phone')}>
                <Text style={styles.editPhoneText}>Edit mobile number</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={!otp}
              >
                <Text style={styles.buttonText}>{submitting ? 'Submitting...' : 'Submit'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resend}
                onPress={handleResendOtp}
                disabled={resending}
              >
                <Text style={styles.resendText}>{resending ? 'Resending...' : 'Resend OTP'}</Text>
              </TouchableOpacity>
            </>
          )}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)', // Dark overlay for better text readability
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  otpInfo: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'MerriweatherRegular',
  },
  bold: {
    fontWeight: 'bold',
    color: '#FFD700', // Gold color
    fontFamily: 'MerriweatherBold',
  },
  editPhoneBtn: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  editPhoneText: {
    color: '#FFD700',
    fontSize: 15,
    textDecorationLine: 'underline',
    fontFamily: 'MerriweatherRegular',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#FFFFFF',
    fontFamily: 'MerriweatherBold', // Using the custom font
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    width: '80%',
    maxWidth: 300,
    height: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent white
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A4A4A',
    fontFamily: 'MerriweatherRegular',
  },
  button: {
    width: '80%',
    maxWidth: 300,
    height: 55,
    backgroundColor: '#6A0572', // A deep, rich purple
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    fontFamily: 'MerriweatherBold',
  },
  resend: {
    marginTop: 15,
  },
  resendText: {
    color: '#FFD700', // Gold for resend
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'MerriweatherRegular',
  },
  error: {
    color: '#FF6347', // Tomato red for errors
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'MerriweatherRegular',
    textAlign: 'center',
  },
});