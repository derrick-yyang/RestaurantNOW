import requests

# URL of the Flask backend
url = 'http://localhost:5000/process_image'  # Replace with the appropriate URL

# Path to the image file you want to send
image_path = 'starbucks.jpeg'  # Replace with the actual path to your image file

# Create a POST request with the image file
files = {'image': open(image_path, 'rb')}

# Send the request
response = requests.post(url, files=files)

# Print the response
print(response.text)