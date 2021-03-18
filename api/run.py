import io
from base64 import encodebytes
from PIL import Image
from flask import Flask
from flask import jsonify
from flask_cors import CORS, cross_origin
import os
import json

def get_response_image(image_path):
    pil_img = Image.open(image_path, mode='r') # reads the PIL image
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format='PNG') # convert the PIL image to byte array
    encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
    return encoded_img


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# server side code
image_path = 'C:/Users/hp/Downloads/Gather AI Fullstack Project/fullstack_test_project/img0000.jpg' # point to your image location
encoded_img = get_response_image(image_path)
my_message = 'here is my message' # create your message as per your need
response =  { 'Status' : 'Success', 'message': my_message , 'ImageBytes': encoded_img}
# return jsonify(response) # send the result to client

home_path = "C:/Users/hp/Downloads/Gather AI Fullstack Project/fullstack_test_project"

@app.route('/')
@cross_origin()
def hello_world():
    row = {
        'ImageBytes': None,
    }
    arr = list()
    for file in os.listdir(home_path):
        if file.endswith(".jpg"):
            row = {
                'ImageBytes': None,
                'data': None,
                'id': None
            }
            image_paths = [home_path, file]
            image_file = "/".join(image_paths)
            encoded_image = get_response_image(image_file)
            row['ImageBytes'] = encoded_image
            name = file.split(".")[0]
            json_file = home_path+"/"+name+".json"
            f = open(json_file,)
            data = json.load(f)
            row['data'] = data
            row['id'] = name
            arr.append(row)
            # print(os.path.join(home_path, file))
            # print(row)

    return jsonify(arr)


if __name__ == '__main__':
   app.run(debug=True)