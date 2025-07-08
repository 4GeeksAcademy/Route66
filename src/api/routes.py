"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

import json
from math import log
from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy import select, and_
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from api.models import db, User, Load, LoadRequest, Roles
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
import cloudinary
import cloudinary.uploader
import os
from werkzeug.security import check_password_hash, generate_password_hash
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

cloudinary.config(
    cloud_name=os.environ.get("CLOUDINATY_CLOUD_NAME"),
    api_key=os.environ.get("CLOUDINATY_API_KEY"),
    api_secret=os.environ.get("CLOUDINATY_API_SECRET"),
)


@api.route('/upload', methods=['POST'])
def update_image():
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "the file is required"}), 400
    result = cloudinary.uploader.upload(file)

    if "secure_url" not in result:
        return jsonify({"error": "the image can not be uploader"}), 400

    return jsonify({"secure_url": result["secure_url"]}), 200


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
        return jsonify({"msg": "You do not have permission to register loads"}), 403

    user_id = int(get_jwt_identity())

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No necessary data was received"}), 400

    required_fields = [
        "vehicle_year", "vehicle_make", "vehicle_model",
        "pickup_location", "delivery_location", "payment",
        "days_to_deliver"
    ]

    if not all(field in data for field in required_fields):
        return jsonify({"msg": "Mandatory data is missing"}), 400

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
            status="Pending"
        )
        db.session.add(new_load)
        db.session.commit()

        return jsonify({"msg": "Upload successfully registered.",
                        "new_load": new_load.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "msg": "Error registering the load",
            "error": str(e)
        }), 500


@api.route('/loads', methods=['GET'])
@jwt_required()
def get_loads():
    try:
        jwt_data = get_jwt()
        user_role = jwt_data.get("role")

        if user_role != "carrier":
            return jsonify({"msg": "You do not have permission to view all loads"}), 403

        loads_query = db.session.execute(select(Load)).scalars().all()
        if not loads_query:
            return jsonify({"results": []}), 200

        loads = [load.serialize() for load in loads_query]

        return jsonify({
            "msg": "ok",
            "results": loads,
        }), 200

    except Exception as e:
        return jsonify({"msg": "Internal Server Error", "error": str(e)}), 500


@api.route('/brokerloads', methods=['GET'])
@jwt_required()
def get_my_loads():
    try:
        jwt_data = get_jwt()
        user_role = jwt_data.get("role")
        user_id = int(get_jwt_identity())

        if user_role != "broker":
            return jsonify({"msg": "You do not have permission to view loads"}), 403

        loads_query = db.session.execute(select(Load).where(
            Load.broker_id == user_id)).scalars().all()
        if not loads_query:
            return jsonify({"results": []}), 200

        loads = [load.serialize(detail_level="full") for load in loads_query]

        return jsonify({
            "msg": "ok",
            "results": loads,
        }), 200

    except Exception as e:
        return jsonify({"msg": "Internal Server Error", "error": str(e)}), 500


@api.route('/requestload', methods=['POST'])
@jwt_required()
def create_load_request():
    try:
        jwt_data = get_jwt()
        user_role = jwt_data.get("role")

        if user_role != "carrier":
            return jsonify({"msg": "You do not have permission to post a request."}), 403

        data = request.get_json()
        if not data:
            return jsonify({"msg": "No data provided"}), 400

        carrier_id = int(get_jwt_identity())
        load_id = data.get("load_id")
        price_offer = data.get("price_offer", "0")
        status = "Pending"

        if not load_id:
            return jsonify({"msg": "Missing required fields"}), 400

        existing_request = db.session.execute(select(LoadRequest).where(and_(
            LoadRequest.carrier_id == carrier_id, LoadRequest.load_id == load_id))).scalars().first()

        load = db.session.get(Load, load_id)
        if not load:
            return jsonify({"msg": "Load not found"}), 404

        if existing_request:
            return jsonify({"msg": "You already have a request in this load"}), 409

        new_loadrequest = LoadRequest(
            carrier_id=carrier_id,
            load_id=load_id,
            price_offer=price_offer,
            status=status
        )

        db.session.add(new_loadrequest)
        db.session.commit()
        return jsonify({"msg": "Request created",
                        "request": new_loadrequest.serialize()}), 201
    except Exception as e:
        return jsonify({"msg": "Internal Server Error", "error": str(e)}), 500


@api.route('/deleteload/<int:load_id>', methods=['DELETE'])
@jwt_required()
def delete_load(load_id):
    try:
        jwt_data = get_jwt()
        broker_id = int(get_jwt_identity())
        user_role = jwt_data.get("role")

        if user_role != "broker":
            return jsonify({"msg": "You do not have permission to delete this load."}), 403

        load = db.session.execute(
            select(Load).where(
                and_(Load.id == load_id, Load.broker_id == broker_id)
            )
        ).scalar_one_or_none()

        if not load:
            return jsonify({"msg": "Load not found or does not belong to this broker."}), 404

        serialized_load = load.serialize(detail_level="medium")

        db.session.delete(load)
        db.session.commit()

        return jsonify({"msg": "Load successfully deleted.",
                        "load": serialized_load}), 200

    except Exception as e:
        return jsonify({"msg": "Internal Server Error", "error": str(e)}), 500


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
    number_of_trucks = data.get('number_of_trucks')

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
        number_of_trucks=number_of_trucks,

    )
    new_user.set_password(password)

    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({"msg": "Usuario carrier registrado exitosamente."}), 201
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
            "mensaje": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({
            "exitoso": False,
            "mensaje": "Invalid credentials. Please verify your email and password."
        }), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role.value}
    )
    return jsonify({
        "exitoso": True,
        "user": user.serialize(),
        "access_token": access_token,
    }), 200


@api.route('/checkPasswordResetEmail', methods=['POST'])
def checkPasswordResetEmail():
    data = request.get_json()
    if not data or not data.get("userId") or not data.get("emailEncrypt"):
        return jsonify({"msg": "Email y el encrypt es requerido"}), 400

    user = User.query.filter_by(id=data["userId"]).first()

    if not user or not check_password_hash(data.get("emailEncrypt"), user.email):
        return jsonify({"msg": "Datos no validos"}), 401

    return jsonify({
        "msg": "Exito",
        "full_name": user.full_name,
        "email": user.email,
    }), 200


@api.route('/savePasswordReset', methods=['POST'])
def savePasswordReset():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("newPassword"):
        return jsonify({"msg": "Email y contraseña son datos requeridos", "success": False}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if user == None:
        return jsonify({"msg": "Email no existe", "success": False}), 400

    user.set_password(data.get("newPassword"))
    db.session.add(user)

    try:
        db.session.commit()
        return jsonify({
            "success": True,
            "msg": "Password restablecido"
        }), 201
    except Exception as e:
        db.session.rollback()
        import traceback
        print(traceback.format_exc())
        return jsonify({"msg": "Error al restablecer contraseña.", "error": str(e), "success": False}), 500


@api.route('/passwordResetEmail', methods=['POST'])
def passwordResetEmail():
    data = request.get_json()
    if not data or not data.get("email"):
        return jsonify({"msg": "Email es requerido"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if user == None:
        return jsonify({"msg": "Email no existe"}), 400

    emailEncrypt = generate_password_hash(data["email"])
    load_dotenv()
    front_url = os.getenv("VITE_FRONT_URL")

    print(front_url)

    body = 'Para reinciar tu contraseña presiona click en este enlace <a href="' + \
        front_url + 'Formpasswordreset/' + str(user.id) + '/' + \
        emailEncrypt + '">Restablecer contraseña</a>'

    send_email('Route66 - Password Reset', body, data["email"])

    return jsonify({
        "msg": "Exito",
        "encrypt": emailEncrypt
    }), 200


def send_email(subject, body_html, to_email):
    try:
        smtp_server = 'smtp.gmail.com'
        smtp_port = 587
        from_email = 'gsimsa2016@gmail.com'
        password = 'goxedesltdxforts'  # Debe ser una contraseña de aplicación válida

        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = from_email
        msg['To'] = to_email

        # Cuerpo del mensaje como HTML (y texto plano opcional)
        # texto plano
        msg.set_content("Este correo requiere un cliente que soporte HTML.")
        msg.add_alternative(body_html, subtype='html')  # versión HTML

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(from_email, password)
            server.send_message(msg)
            return True
    except Exception as e:
        print("Error enviando email:", str(e))
        return False


@api.route('/profile/broker', methods=['GET', 'PUT'])
@jwt_required()
def handle_broker_profile():
    jwt_data = get_jwt()
    user_role = jwt_data.get("role")
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404
    if user_role != "broker":
        return jsonify({"msg": "You do not have permission to view this profile"}), 403

    if request.method == 'GET':
        return jsonify({
            "fullName": user.full_name,
            "companyName": user.company_name,
            "email": user.email,
            "phoneNumber": user.phone_number,
            "address": user.address,
            "city": user.city,
            "state": user.state,
            "zip": user.zip,
            "role": user.role.value,
            "avatar_url": user.avatar_url
        }), 200

    elif request.method == 'PUT':
        data = request.get_json()

        if not data:
            return jsonify({"msg": "No data received to update"}), 400

        try:
            if 'fullName' in data:
                user.full_name = data['fullName']
            if 'companyName' in data:
                user.company_name = data['companyName']
            if 'email' in data:
                if '@' not in data['email'] or '.' not in data['email']:
                    return jsonify({"msg": "Invalid email format"}), 400
                user.email = data['email']
            if 'phoneNumber' in data:
                user.phone_number = data['phoneNumber']
            if 'address' in data:
                user.address = data['address']
            if 'city' in data:
                user.city = data['city']
            if 'state' in data:
                user.state = data['state']
            if 'zip' in data:
                user.zip = data['zip']
            if 'avatarUrl' in data:
                user.avatar_url = data['avatarUrl']

            db.session.commit()

            return jsonify({
                "msg": "Profile updated successfully",
                "fullName": user.full_name,
                "companyName": user.company_name,
                "email": user.email,
                "phoneNumber": user.phone_number,
                "address": user.address,
                "city": user.city,
                "state": user.state,
                "zip": user.zip,
                "role": user.role.value,
                "avatar_url": user.avatar_url
            }), 200

        except Exception as e:
            db.session.rollback()
            print(f"Error updating user profile: {e}")
            return jsonify({"msg": "Internal server error while updating profile"}), 500

    return jsonify({"msg": "Disallowed method"}), 405


@api.route('/profile/carrier', methods=['GET', 'PUT'])
@jwt_required()
def handle_carrier_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    if user.role != Roles.carrier:
        return jsonify({"msg": "You do not have permission to access this carrier profile"}), 403

    if request.method == 'GET':
        return jsonify({
            "fullName": user.full_name,
            "companyName": user.company_name,
            "email": user.email,
            "phoneNumber": user.phone_number,
            "address": user.address,
            "city": user.city,
            "state": user.state,
            "zip": user.zip,
            "role": user.role.value,
            "usdotNumber": user.usdot_number,
            "typeOfTransport": user.type_of_transport,
            'numberOfTrucks': user.number_of_trucks
        }), 200

    elif request.method == 'PUT':
        data = request.get_json()
        if not data:
            return jsonify({"msg": "No data received to update"}), 400

        try:

            if 'fullName' in data:
                user.full_name = data['fullName']
            if 'companyName' in data:
                user.company_name = data['companyName']

            if 'email' in data and data['email'] != user.email:
                if not ("@" in data['email'] and "." in data['email']):
                    return jsonify({"msg": "Formato de correo electrónico inválido"}), 400
                if User.query.filter(and_(User.email == data['email'], User.id != user.id)).first():
                    return jsonify({"msg": "This email address is already registered by another user"}), 409
                user.email = data['email']

            if 'phoneNumber' in data:
                user.phone_number = data['phoneNumber']
            if 'address' in data:
                user.address = data['address']
            if 'city' in data:
                user.city = data['city']
            if 'state' in data:
                user.state = data['state']
            if 'zip' in data:
                user.zip = data['zip']
            if 'usdotNumber' in data:
                user.usdot_number = data['usdotNumber']
            if 'typeOfTransport' in data:
                user.type_of_transport = data['typeOfTransport']
            if 'numberOfTrucks' in data:
                user.number_of_trucks = data['numberOfTrucks']

            db.session.commit()

            return jsonify({
                "msg": "Carrier profile successfully updated",
                "fullName": user.full_name,
                "companyName": user.company_name,
                "email": user.email,
                "phoneNumber": user.phone_number,
                "address": user.address,
                "city": user.city,
                "state": user.state,
                "zip": user.zip,
                "role": user.role.value,
                "usdotNumber": user.usdot_number,
                "typeOfTransport": user.type_of_transport,
                "numberOfTrucks": user.number_of_trucks
            }), 200

        except Exception as e:
            db.session.rollback()
            print(f"Error updating carrier profile: {e}")
            import traceback
            print(traceback.format_exc())
            return jsonify({"msg": "Internal server error while updating carrier profile"}), 500

    return jsonify({"msg": "Disallowed method"}), 405


@api.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_profile_by_id(user_id):

    user = db.session.get(User, user_id)
    print(user)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    profile_data = {
        "id": user.id,
        "fullName": user.full_name,
        "companyName": user.company_name,
        "email": user.email,
        "phoneNumber": user.phone_number,
        "address": user.address,
        "city": user.city,
        "state": user.state,
        "zip": user.zip,
        "role": user.role.value
    }

    if user.role == Roles.carrier:
        profile_data.update({
            "usdotNumber": user.usdot_number,
            "typeOfTransport": user.type_of_transport,
            "numberOfTrucks": user.number_of_trucks,
        })

    return jsonify(profile_data), 200
