"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from ast import USub
from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy import Null, null
from api.DTOs.LoginDto import LoginDto
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup/carrier', methods=['POST'])
def register_carrier():
    data = request.get_json()

    if not data:
        return jsonify({"msg": "No se recibieron datos necesarios"}), 400

    required_fields = [
        "email", "password", "company_name", "full_name", "mc_number", "phone_number", "address", "city", "state", "zip"]

    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Faltan datos obligatorios"}), 400

    email = data['email']
    password = data['password']
    company_name = data['company_name']
    full_name = data['full_name']
    mc_number = data['mc_number']
    if data["role"] == "carrier":
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
    if User.query.filter_by(usdot_number=usdot_number).first():
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
        role=data["role"]
    )
    new_user.set_password(password)

    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({"msg": "Usuario registrado exitosamente."}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al registrar el usuario.", "error": str(e)}), 500


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    try:

        exitoso = False
        mensaje = ''
        token = ''

        userBD = User.query.filter_by(email=data["email"]).first()

        if userBD is None:
            exitoso = False
            mensaje = 'Inicio sesion incorrecto'
        else:
            passwordCorrecto = User.check_password(userBD, data["password"])
            if passwordCorrecto:
                exitoso = True
                mensaje = 'Inicio sesion correcto'
                print(userBD)

                access_token = create_access_token(
                    identity=userBD.email,
                    additional_claims={"role": userBD.role.value})
                token = access_token

            else:
                exitoso = False
                mensaje = 'Inicio sesion incorrecto'

        return jsonify({
            "exitoso": exitoso,
            "mensaje": mensaje,
            "token": token
        }), 200
    except Exception as e:
        return jsonify({"msg": "Error al realizar login", "error": str(e)}), 500
