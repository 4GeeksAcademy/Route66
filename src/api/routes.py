"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import json
from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy import Null, null, select, and_
from api.DTOs.LoginDto import LoginDto
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from api.models import db, User, Load, LoadRequest
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

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
            status="Pending"
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
            return jsonify({"msg": "No registered loads found"}), 404

        loads = [load.serialize() for load in loads_query]

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
        return jsonify({"msg": "Email y contraseña son requeridos"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role.value}
    )

    return jsonify({
        "user": user.serialize(),
        "access_token": access_token,
        "exitoso": True
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
