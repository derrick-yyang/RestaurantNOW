from flask import Flask, request
import cv2
import pytesseract
import numpy as np

app = Flask(__name__)

def preprocess_image(img):
    # Convert the image to gray scale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Performing OTSU threshold
    ret, thresh1 = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU | cv2.THRESH_BINARY_INV)

    # Specify structure shape and kernel size.
    rect_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (18, 18))

    # Applying dilation on the threshold image
    dilation = cv2.dilate(thresh1, rect_kernel, iterations = 1)

    # Finding contours
    contours, hierarchy = cv2.findContours(dilation, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    return contours

@app.route('/process_image', methods=['POST'])
def process_image():
    file = request.files['image']

    # Convert the file to an opencv image.
    img = cv2.imdecode(np.fromstring(file.read(), np.uint8), cv2.IMREAD_UNCHANGED)

    # Preprocess the image to get the contours
    contours = preprocess_image(img)

    # Looping through the identified contours
    # Then rectangular part is cropped and passed on to pytesseract for extracting text from it
    # Extracted text is then written into the text file
    restaurant_name = ''
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)

        # Cropping the text block for giving input to OCR
        cropped = img[y:y + h, x:x + w]

        # Apply OCR to the cropped image
        text = pytesseract.image_to_string(cropped)

        # Assuming the restaurant name would be the largest text block in the image
        if len(text) > len(restaurant_name):
            restaurant_name = text

    return restaurant_name

app.run(debug=True)