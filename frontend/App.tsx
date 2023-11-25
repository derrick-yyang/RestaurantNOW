import React, {useEffect, useRef, useState} from 'react';
import {RNCamera} from 'react-native-camera';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {PermissionsAndroid, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

function App(): JSX.Element {
  const cameraRef = useRef<RNCamera>(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [viewRestaurant, setViewRestaurant] = useState(false);
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(
    null,
  );

  // Define a type for your restaurant data
  type RestaurantData = {
    name: string;
    description: string;
  };

  useEffect(() => {
    // Simulate fetching data from a backend
    const fetchData = async () => {
      // Simulated data, replace with your backend fetch logic
      const data = {
        name: 'Pasta Paradise',
        description:
          "McDonald's is a global fast food restaurant chain that originated in the United States. It's known for its wide range of fast food items, with its most iconic products being the Big Mac (a double-decker hamburger), the Quarter Pounder, the Egg McMuffin, and its world-famous French fries. McDonald's is also recognized for its Happy Meals, which are targeted towards children and often include a small toy. The company has a distinctive logo, the Golden Arches, and is famous for its efficiency in serving food, utilizing a production line method of food preparation. Over the years, McDonald's has become a symbol of globalization and American fast food culture. It operates thousands of restaurants worldwide, offering a variety of localized menu items in different countries to cater to regional tastes.",
      };

      // Simulate a network request delay
      setTimeout(() => setRestaurantData(data), 1000);
    };

    fetchData();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (result === RESULTS.GRANTED) return true;
      if (result === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        return requestResult === RESULTS.GRANTED;
      }
      return false;
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true};
      try {
        const data = await cameraRef.current.takePictureAsync(options);
        setCapturedUri(data.uri);
      } catch (error) {
        console.error('Error taking picture', error);
      }
    } else {
      console.log('Camera is not ready');
    }
  };

  const retakePicture = () => {
    setCapturedUri(null);
  };

  const confirmPicture = () => {
    console.log('Picture confirmed:', capturedUri);
    setViewRestaurant(true);
  };

  const goBackToCamera = () => {
    setViewRestaurant(false);
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = {uri: response.assets[0].uri};
        setCapturedUri(source.uri);
      }
    });
  };

  if (viewRestaurant && restaurantData) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Image source={{uri: capturedUri}} style={styles.restaurantImage} />

          <Text style={styles.restaurantName}>{restaurantData.name}</Text>
          <View style={styles.info}>
            <Text style={styles.restaurantDetails}>
              {restaurantData.description}
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity onPress={goBackToCamera} style={styles.backButton}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Take a picture of the unknown restaurant !!!
        </Text>
      </View>

      {capturedUri ? (
        <>
          <Image source={{uri: capturedUri}} style={styles.preview} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={retakePicture}
              style={styles.actionButton}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmPicture}
              style={styles.actionButton}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            captureAudio={false}
          />
          <TouchableOpacity onPress={takePicture} style={styles.capture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
          <TouchableOpacity onPress={openGallery} style={styles.galleryButton}>
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    padding: 5,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
  },
  preview: {
    width: '90%',
    height: '77%',
    borderRadius: 50,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  capture: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '2%',
    marginBottom: '0%',

    // Dimensions to create a circular shape for the button
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'red',
    padding: 4,
  },
  captureInner: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    margin: '7%',
  },
  actionButton: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '7%',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    width: 100,
    top: '93%',
    right: 150,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 20,
  },
  scrollView: {
    marginBottom: 60,
  },
  restaurantInfo: {
    padding: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  restaurantDetails: {
    fontSize: 18,
    color: 'black',
  },
  info: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  reviewerName: {
    fontWeight: 'bold',
    color: 'black',
  },
  restaurantImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  galleryButton: {
    backgroundColor: 'red',
    padding: 10,
    width: 100,
    top: '4%',
    right: -30,
    borderRadius: 20,
  },
});

export default App;
