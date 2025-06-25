"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User,Load
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/load_register', methods=['POST'])
@jwt_required()
def loads_register():
    claims = get_jwt()
    user_role = claims.get("role") 

    if user_role != "broker":
        return jsonify({"msg": "No tienes permiso para registrar cargas"}), 403
    

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se recibieron datos necesarios"}), 400

    required_fields=[
        "vehicle_year", "vehicle_make", "vehicle_model", "pickup_Location", "payment","days_to_deliver"]
    
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan datos obligatorios"}), 400
    
    vehicle_year = data['vehicle_year']
    vehicle_make = data['vehicle_make']
    vehicle_model = data['vehicle_model']
    pickup_Location = data['pickup_Location']
    payment = data['payment']
    days_to_deliver = data['days_to_deliver']

    new_load = Load(
        vehicle_year =vehicle_year,
        vehicle_make=vehicle_make,
        vehicle_model= vehicle_model,
        pickup_Location=pickup_Location,
        payment=payment,
        days_to_deliver=days_to_deliver
        )

    db.session.add(new_load)
    try:
        db.session.commit()
        return jsonify({"msg": "Carga registrada exitosamente."}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al registrar la carga", "error": str(e)}), 500

