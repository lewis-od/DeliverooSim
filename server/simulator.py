from flask import Blueprint, g, request, jsonify
from server.config import api_key

bp = Blueprint('simulator', __name__)

@bp.route('/')
def index():
    return api_key
