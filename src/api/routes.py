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

@api.route('/<int:user_id>/load_register', methods=['POST'])
@jwt_required()
def loads_register():
    jwt_data = get_jwt()
    user_role = jwt_data.get("role")

    
    if user_role != "broker":
        return jsonify({"msg": "No tienes permiso para registrar cargas"}), 403
    

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se recibieron datos necesarios"}), 400
    

    required_fields=[
        "vehicle_year", "vehicle_make", "vehicle_model", "pickup_location","delivery_location", "payment","days_to_deliver", "status"]
    
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan datos obligatorios"}), 400
    
    user_id =  get_jwt_identity()
    vehicle_year = data['vehicle_year']
    vehicle_make = data['vehicle_make']
    vehicle_model = data['vehicle_model']
    pickup_location = data['pickup_location']
    delivery_location = data['delivery_location']
    payment = data['payment']
    days_to_deliver = data['days_to_deliver']
    status= data['status']

    new_load = Load(
        user_id = user_id,
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


@api.route('/signup/carrier', methods=['POST'])

def register_carrier():
    data = request.get_json()
    
    if not data:
        return jsonify({"msg": "No se recibieron datos necesarios"}), 400

    required_fields = [
        "email", "password", "company_name", "full_name", "mc_number",
        "phone_number", "address", "city", "state", "zip", "role"
    ]
    
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan datos obligatorios"}), 400

    role = data.get("role")
    if role != "carrier":
        return jsonify({"msg": "Este endpoint es solo para registros tipo 'carrier'"}), 400

    
    email = data['email']
    password = data['password']
    company_name = data['company_name']
    full_name = data['full_name']
    mc_number = data['mc_number']
    usdot_number = data.get('usdot_number')
    phone_number = data['phone_number']
    address = data['address']
    city = data['city']
    state = data['state']
    zip_code = data['zip']
    type_of_transport = data.get('type_of_transport')

    
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El usuario con este correo electrónico ya está registrado."}), 409
    if User.query.filter_by(phone_number=phone_number).first():
        return jsonify({"msg": "El usuario con este número telefónico ya está registrado."}), 409
    if User.query.filter_by(mc_number=mc_number).first():
        return jsonify({"msg": "El MC Number ya está registrado."}), 409
    if usdot_number and User.query.filter_by(usdot_number=usdot_number).first():
        return jsonify({"msg": "El USDOT Number ya está registrado."}), 409


    new_user = User(
        email=email,
        company_name=company_name,
        full_name=full_name,
        mc_number=mc_number,
        usdot_number=usdot_number,
        phone_number=phone_number,
        address=address,
        city=city,
        state=state,
        zip=zip_code,
        type_of_transport=type_of_transport,
        role=role
    )
    new_user.set_password(password)

    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({"msg": "Usuario carrier registrado exitosamente."}), 201
    except Exception as e:
        db.session.rollback()
        import traceback
        print(traceback.format_exc())
        return jsonify({"msg": "Error al registrar el usuario.", "error": str(e)}), 500

    

@api.route('/signup/broker', methods=['POST'])

def register_broker():
    data = request.get_json()
    
    if not data:
        return jsonify({"msg": "No se recibieron datos necesarios"}), 400

    required_fields = [
        "email", "password", "company_name", "full_name", "mc_number",
        "phone_number", "address", "city", "state", "zip", "role"
    ]
    
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan datos obligatorios"}), 400

    role = data.get("role")
    if role != "broker":
        return jsonify({"msg": "Este endpoint es solo para registros tipo 'broker'"}), 400

    
    email = data['email']
    password = data['password']
    company_name = data['company_name']
    full_name = data['full_name']
    mc_number = data['mc_number']
    phone_number = data['phone_number']
    address = data['address']
    city = data['city']
    state = data['state']
    zip_code = data['zip']

    
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "El usuario con este correo electrónico ya está registrado."}), 409
    if User.query.filter_by(phone_number=phone_number).first():
        return jsonify({"msg": "El usuario con este número telefónico ya está registrado."}), 409
    if User.query.filter_by(mc_number=mc_number).first():
        return jsonify({"msg": "El MC Number ya está registrado."}), 409

    
    new_user = User(
        email=email,
        company_name=company_name,
        full_name=full_name,
        mc_number=mc_number,
        phone_number=phone_number,
        address=address,
        city=city,
        state=state,
        zip=zip_code,
        role=role
    )
    new_user.set_password(password)

    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({"msg": "Usuario broker registrado exitosamente."}), 201
    except Exception as e:
        db.session.rollback()
        import traceback
        print(traceback.format_exc())
        return jsonify({"msg": "Error al registrar el usuario.", "error": str(e)}), 500

