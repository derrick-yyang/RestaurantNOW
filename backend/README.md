# How to run this backend
`run.py` contains the server code. It utilizes OpenAI's `gpt4-vision` API to recognize the image and return it's response.
Please ensure you have setup your environment with an OpenAI API key and a subscription to GPT Plus.

## To test the endpoint:
You can write a test harness that sends a POST request to the endpoint. Below is an example using `requests` in python:
```python
import requests

# URL of the Flask backend
url = 'localhost:5000/process_image'  # Replace with your host URL

# Path to the test image
image_path = ''  # Replace with the path to your test image

# Open the image in binary mode
with open(image_path, 'rb') as image:
    # Define the payload for the POST request
    files = {'image': (image_path, image, 'image/jpeg')}

    # Send the POST request to the Flask backend
    response = requests.post(url, files=files)

    print(response.json())
```

Be sure to send an image along with your request.

*Note: There is a python script `test_api.py` that you can run to test the endpoint*


