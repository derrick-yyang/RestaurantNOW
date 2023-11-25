import requests

# URL of the Flask backend
url = 'http://127.0.0.1:5000/process_image'  # Replace with your Flask server's URL if different

# Path to the test image
image_path = 'starbucks.jpeg'  # Replace with the path to your test image

# Open the image in binary mode
with open(image_path, 'rb') as image:
    # Define the payload for the POST request
    files = {'image': (image_path, image, 'image/jpeg')}

    # Send the POST request to the Flask backend
    response = requests.post(url, files=files)

    print(response.json())



