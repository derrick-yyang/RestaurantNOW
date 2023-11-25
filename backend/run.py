from flask import Flask, request, jsonify
import base64
from openai import OpenAI

app = Flask(__name__)

# Function to encode the image
def encode_image(image):
    return base64.b64encode(image.read()).decode('utf-8')

@app.route('/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return "No image provided", 400

    image = request.files['image']

    # Encode the image
    base64_image = encode_image(image)

    client = OpenAI()

    # Define a chat prompt (prompt engineering)
    chat_prompt = """
    What restaurant is this image? Answer by saying the name of the restaurant, then a description of what it is and what it's known for.
    Split the name and description a question mark (?) but have it on the same line.
    """
    gpt_model = "gpt-4-vision-preview"

    gpt_response = client.chat.completions.create(
        model=gpt_model,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"{chat_prompt}"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        max_tokens=150,
    )

    name, description = gpt_response.choices[0].message.content.split('?')

    response = {
        'Name' : name,
        'Description': description
    }

    return jsonify(response)

app.run(debug=True)
