from flask import Blueprint, g, request, jsonify
from server.config import maps_key, clarifai_key
from clarifai.rest import ClarifaiApp
import googlemaps
import random

bp = Blueprint('simulator', __name__)

@bp.route('/')
def index():
    return "Hello, world"

@bp.route('/restaurant')
def restaurant():
    latitude = request.args.get('lat')
    longitude = request.args.get('long')

    location = "{},{}".format(latitude, longitude)

    maps = googlemaps.Client(key=maps_key)
    response = maps.places('restaurant', location=location)
    if response['status'] != "OK":
        raise Exception("Google maps error")

    results = response['results']
    restaurant_id = random.choice(results)['place_id']

    response = maps.place(restaurant_id)
    if response['status'] != 'OK':
        raise Exception("Google maps error")

    restaurant = response['result']

    food_url = "No image found."
    for photo_info in restaurant['photos']:
        reference = photo_info['photo_reference']
        img_url = ("https://maps.googleapis.com/maps/api/place/photo?key={}"
            "&photoreference={}&maxwidth=250").format(maps_key, reference)
        classifier = ClarifaiApp(api_key=clarifai_key)
        model = classifier.models.get('general-v1.3')

        classification = model.predict_by_url(img_url)
        if classification['status']['code'] != 10000:
            continue

        concepts = classification['outputs'][0]['data']['concepts'][0:4]
        keywords = [c['name'] for c in concepts]
        if 'food' in keywords:
            food_url = img_url
            break

    res_dict = {
        'location': restaurant['geometry']['location'],
        'name': restaurant['name'],
        'image': food_url
    }
    return jsonify(res_dict)
