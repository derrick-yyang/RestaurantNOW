from flask import Flask, request

app = Flask(__name__)

@app.route('/process_image', methods=['POST'])
def process_image():
    # Check if the request contains a file
    if 'image' not in request.files:
        return 'No image file uploaded'

    image = request.files['image']

    # Perform image processing here
    # For demonstration purposes, we'll just read the file and return "Hello, World!"

    # Read the file
    image_data = image.read()

    # Perform image processing here (e.g., using a library like PIL or OpenCV)

    # Return the response
    return 'Hello, World!'

if __name__ == '__main__':
    app.run()