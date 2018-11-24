from flask import Blueprint, g, request, jsonify
from server.config import api_key
import googlemaps
import random

bp = Blueprint('simulator', __name__)

@bp.route('/')
def index():
    return "Hello, world"

@bp.route('/restaurant/<string:location>')
def restaurant(location):
    maps = googlemaps.Client(key=api_key)
    response = maps.places('restaurant', location=location)
    if response['status'] != "OK":
        raise Exception("Google maps error")

    results = response['results']
    restaurant = random.choice(results)
    res_dict = {
        'location': restaurant['geometry']['location'],
        'name': restaurant['name']
    }
    return jsonify(res_dict)
