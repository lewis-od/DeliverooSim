from flask import Blueprint, g, request, jsonify
from server.config import maps_key, clarifai_key
from server.models import Restaurant
from clarifai.rest import ClarifaiApp
import googlemaps
import random
import math

bp = Blueprint('simulator', __name__)

@bp.route('/')
def index():
    return "Hello, world"

@bp.route('/restaurant')
def restaurant():
    latitude = request.args.get('lat')
    longitude = request.args.get('lng')

    location = "{},{}".format(latitude, longitude)

    maps = googlemaps.Client(key=maps_key)
    response = maps.places('restaurant', location=location)
    if response['status'] != "OK":
        raise Exception("Google maps error: status {}".format(response['status']))

    results = response['results']
    restaurant_dict = random.choice(results)
    restaurant_id = restaurant_dict['place_id']

    restaurant = Restaurant.get_by_place_id(restaurant_id)
    if restaurant is not None:
        res_dict = {
            'location': restaurant_dict['geometry']['location'],
            'name': restaurant_dict['name'],
            'image': restaurant.image_url
        }
        return jsonify(res_dict)

    response = maps.place(restaurant_id)
    if response['status'] != 'OK':
        raise Exception("Google maps error: status {}".format(response['status']))

    restaurant_dict = response['result']

    food_url = None
    for photo_info in restaurant_dict['photos']:
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
    if food_url is None:
        food_url = "https://thumbs.dreamstime.com/z/man-eating-food-4703099.jpg"
    restaurant = Restaurant(place_id=restaurant_id, image_url=food_url).create()

    res_dict = {
        'location': restaurant_dict['geometry']['location'],
        'name': restaurant_dict['name'],
        'image': food_url
    }
    return jsonify(res_dict)

@bp.route('/destination')
def destination():
    lat = request.args.get('lat')
    long = request.args.get('lng')

    r = 3950.0 # Radius of Earth in miles
    d = 1.0 # Max distance from restaurant

    address = "Unnamed Road"
    while "Unnamed Road" in address:
        # Convert lat/long to radians
        theta = (float(lat) / 90) * math.pi
        phi = (float(long) / 180) * math.pi

        # One mile in lat/long angles
        one_mile = d / r

        c1 = (random.random() * 2) - 1
        c2 = (random.random() * 2) - 1

        dtheta = c1 * one_mile
        dphi = c2 * one_mile

        phi_new = phi + dphi
        theta_new = theta + dtheta

        lat_new = (theta_new / math.pi) * 90
        long_new = (phi_new / math.pi) * 180

        location_str = "{},{}".format(lat_new, long_new)
        maps = googlemaps.Client(key=maps_key)
        response = maps.reverse_geocode(location_str)
        address = response[0]['formatted_address']

    return jsonify({'location': {'lat': lat_new, 'lng': long_new}, 'address': address})
