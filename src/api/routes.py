"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy import Null, null
from api.DTOs.LoginDto import LoginDto
from api.models import db, User,Load
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from werkzeug.security import check_password_hash

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
    jwt_data = get_jwt()
    user_role = jwt_data.get("role")

    if user_role != "broker":
        return jsonify({"msg": "No tienes permiso para registrar cargas"}), 403

    user_id = int(get_jwt_identity())

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se recibieron datos necesarios"}), 400

    required_fields = [
        "vehicle_year", "vehicle_make", "vehicle_model",
        "pickup_location", "delivery_location", "payment",
        "days_to_deliver"
    ]

    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan datos obligatorios"}), 400

    try:
        new_load = Load(
            broker_id=user_id,
            vehicle_year=data['vehicle_year'],
            vehicle_make=data['vehicle_make'],
            vehicle_model=data['vehicle_model'],
            pickup_location=data['pickup_location'],
            delivery_location=data['delivery_location'],
            payment=float(data['payment']),
            days_to_deliver=int(data['days_to_deliver']),
            status="pendiente"
        )

        db.session.add(new_load)
        db.session.commit()

        return jsonify({"msg": "Carga registrada exitosamente."}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "msg": "Error al registrar la carga",
            "error": str(e)
        }), 500


@api.route('/signup/carrier', methods=['POST'])
def register_carrier():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "No se recibieron datos necesarios"}), 400

    required_fields = [
        "email", "password", "company_name", "full_name", "mc_number", "phone_number", "address", "city", "state", "zip", "usdot_number"]
    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan datos obligatorios"}), 400

    email = data['email']
    password = data['password']
    company_name = data['company_name']
    full_name = data['full_name']
    mc_number = data['mc_number']
    usdot_number = data['usdot_number']
    phone_number = data['phone_number']
    address = data['address']
    city = data['city']
    state = data['state']
    zip_code = data['zip']
    type_of_transport = data.get('type_of_transport', None)

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
        type_of_transport=type_of_transport,
        role="carrier",
        usdot_number=usdot_number,

    )
    new_user.set_password(password)

    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({"msg": "Usuario broker registrado exitosamente."}), 201
    except Exception as e:
        db.session.rollback()
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


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({
            "exitoso": False,
            "mensaje": "Email y contraseña son requeridos."
        }), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({
            "exitoso": False,
            "mensaje": "Credenciales inválidas. Por favor, verifica tu email y contraseña." 
        }), 401 

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={
            "role": user.role.value, 
            "user_id": str(user.id)  
        }
    )
    return jsonify({
        "exitoso": True,  
        "mensaje": "Inicio de sesión exitoso.", 
        "token": access_token 
    }), 200



@api.route('/profile/broker', methods=['GET'])
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify({
        "fullName": user.full_name,
        "companyName": user.company_name,
        "email": user.email,
        "phoneNumber": user.phone_number,
        "address": user.address,
        "city": user.city,
        "state": user.state,
        "zip": user.zip,
        "role": user.role.value
    }), 200



