import React, { useRef, useState } from 'react';
import { RNCamera } from 'react-native-camera';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';

function App(): JSX.Element {
  const cameraRef = useRef(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [viewConfirmedPic, setViewConfirmedPic] = useState(false); // New state for confirmed picture view

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      setCapturedUri(data.uri);
    }
  };

  const retakePicture = () => {
    setCapturedUri(null);
    setViewConfirmedPic(false); // Reset to camera view
  };

  const confirmPicture = () => {
      console.log('Picture confirmed:', capturedUri);
      setViewConfirmedPic(true);
    };

    const goBackToCamera = () => {
      setViewConfirmedPic(false);
    };

   if (viewConfirmedPic && capturedUri) {
      return (
        <SafeAreaView style={styles.container}>
          <Image source={{ uri: capturedUri }} style={styles.fullImage} />
          <Text style={styles.confirmationText}>sadaadsad</Text>
          <TouchableOpacity onPress={goBackToCamera} style={styles.backButton}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }

  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Take picture of unknown restaurant !!!</Text>
        </View>

        {capturedUri ? (
          <>
            <Image source={{ uri: capturedUri }} style={styles.preview} />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={retakePicture} style={styles.actionButton}>
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmPicture} style={styles.actionButton}>
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
          </>
        )}

        {/* Modal is removed */}
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
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
  preview: {
      width: '90%', // Set the width as a percentage of the screen width
      height: '75%', // Adjust the height as needed
      borderRadius: 50, // This will give you rounded corners
      overflow: 'hidden', // This ensures that the camera view does not bleed outside the border radius
      alignSelf: 'center', // Center the camera view horizontally
      // Remove justifyContent and alignItems if you want the camera to fill the preview box
    },
  capture: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
      bottom: "5%", // Adjust this value to move it up from the bottom
      marginBottom: '0%', // Adjust this value to increase the space at the bottom

      // Dimensions to create a circular shape for the button
      width: 70,
      height: 70,
      borderRadius: 35, // Half of the width and height to get a perfect circle
      backgroundColor: 'red', // Red border color
      padding: 4, // Space for the red border
    },
  captureInner: {
      width: '100%',
      height: '100%',
      borderRadius: 32, // Slightly smaller radius for the inner circle to appear like a border
      backgroundColor: 'white', // White inner color
      justifyContent: 'center',
      alignItems: 'center',
    },
  captureIcon: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain', // Ensures the image scales within the button
    },
  captureText: {
    fontSize: 14,
    color: 'white',
  },
  capturedImage: {
      width: '80%', // Adjust as needed
      height: '80%', // Adjust as needed
      borderRadius: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
      },

      modalImage: {
        width: '90%', // Set the width as a percentage of the screen width
        height: '80%', // Adjust the height as needed
        borderRadius: 20, // Rounded corners for the image
      },
       buttonContainer: {
           flexDirection: 'row', // places buttons in a row
           justifyContent: 'center', // centers buttons horizontally
           alignItems: 'center', // centers buttons vertically
           alignSelf: 'center', // centers the container itself
           margin: '7%',
         },
         actionButton: {
           width: 100,
           height: 40,
           borderRadius: 20,
           backgroundColor: 'red', // change as needed
           justifyContent: 'center',
           alignItems: 'center',
           marginHorizontal: '7%', // adds spacing between buttons
         },
         buttonText: {
           fontSize: 16,
           color: 'white', // change as needed
         },
          fullImage: {
             width: '100%', // Full width
             height: '50%', // Adjust the height as needed, taking up half the screen
             resizeMode: 'cover', // or 'contain' to see the whole picture without cropping
           },
           confirmationText: {
             fontSize: 30,
             textAlign: 'center',
             color: 'black',
             marginTop: '40%', // Adjust as needed for your layout
           },
    backButton: {
        position: 'absolute',
        width: 100,
        top: '90%', // You can adjust this value as needed
        right: 150, // You can adjust this value as needed
        backgroundColor: 'red', // Or any other visible color
        padding: 10,
        borderRadius: 5,
      },
      buttonText: {
        fontSize: 16,
        color: 'white', // Ensure this is visible against the backButton color
        textAlign: 'center',
      },
});

export default App;