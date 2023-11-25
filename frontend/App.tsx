import React, {useRef, useState} from 'react';
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
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import {Platform} from 'react-native';

function App(): JSX.Element {
  const cameraRef = useRef<RNCamera>(null);
  const [capturedUri, setCapturedUri] = useState<string | undefined>(undefined);
  const [viewRestaurant, setViewRestaurant] = useState(false);
  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(
    null,
  );
  const [isError, setIsError] = useState(false);

  type RestaurantData = {
    name: string;
    description: string;
    error: string;
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
  const retake = () => {
    setCapturedUri(undefined);
    setViewRestaurant(false);
    setIsError(false);
  };

  const confirmPicture = async () => {
    if (capturedUri) {
      console.log('Picture confirmed:', capturedUri);

      // Create a new FormData object
      let formData = new FormData();
      formData.append('image', {
        uri:
          Platform.OS === 'android'
            ? capturedUri
            : capturedUri.replace('file://', ''),
        type: 'image/jpeg', // or the correct type of your image
        name: 'upload.jpg',
      });

      try {
        const response = await fetch('http://10.0.2.2:5000/process_image', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.error !== 'Restaurant was not recognized. Please try again.') {
          setRestaurantData(data);
          setViewRestaurant(true);
        } else {
          console.error(
            'Error in API response:',
            data.error || 'Unknown error',
          );
          setIsError(true);
        }
      } catch (error) {
        console.error('Error making API call:', error);
        setIsError(true);
      }
    } else {
      console.log('No picture to confirm');
    }
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo', // For photos
      quality: 1,
    } as ImageLibraryOptions;

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        // Check if assets are defined and not empty
        const source = {uri: response.assets[0].uri};
        setCapturedUri(source.uri);
      } else {
        console.log('No assets found');
      }
    });
  };

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          Error: Unable to load data. Please take the picture again.
        </Text>
        {/* Button to retake picture */}
        <TouchableOpacity onPress={retake} style={styles.retakeButton}>
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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

        <TouchableOpacity onPress={retake} style={styles.backButton}>
          <Text style={styles.buttonText}>Back Home</Text>
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
            <TouchableOpacity onPress={retake} style={styles.actionButton}>
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
    backgroundColor: '#9C9492',
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
    backgroundColor: '#9C9492',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '7%',
  },
  retakeButton: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9C9492',
    justifyContent: 'center',
    right: -120,
    marginHorizontal: '7%',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    width: 120,
    top: '93%',
    right: 150,
    backgroundColor: '#9C9492',
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
    backgroundColor: '#9C9492',
    padding: 10,
    width: 100,
    top: '4%',
    right: -30,
    borderRadius: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#9C9492',
    textAlign: 'center',
    margin: 20,
  },
});

export default App;
