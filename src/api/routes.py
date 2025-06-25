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
def loads_register():
   
    user_role="broker"
    if user_role != "broker":
        return jsonify({"msg": "No tienes permiso para registrar cargas"}), 403
    

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se recibieron datos necesarios"}), 400

    required_fields=[
        "vehicle_year", "vehicle_make", "vehicle_model", "pickup_location","delivery_location", "payment","days_to_deliver", "broker_id", "status"]
    
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan datos obligatorios"}), 400
    
    broker_id =  data['broker_id']
    vehicle_year = data['vehicle_year']
    vehicle_make = data['vehicle_make']
    vehicle_model = data['vehicle_model']
    pickup_location = data['pickup_location']
    delivery_location = data['delivery_location']
    payment = data['payment']
    days_to_deliver = data['days_to_deliver']
    status= data['status']

    new_load = Load(
        broker_id = broker_id,
        vehicle_year =vehicle_year,
        vehicle_make=vehicle_make,
        vehicle_model= vehicle_model,
        pickup_location=pickup_location,
        delivery_location= delivery_location,
        payment=payment,
        days_to_deliver=days_to_deliver,
        status=status
        )

    db.session.add(new_load)
    try:
        db.session.commit()
        return jsonify({"msg": "Carga registrada exitosamente."}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al registrar la carga", "error": str(e)}), 500

