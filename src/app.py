"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import email
import os
import traceback
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.DTOs.LoginDto import LoginDto
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response




@app.route('/prueba', methods=['GET'])
def prueba():
    return jsonify({
        'mensaje': '¡Hola desde Flask!',
        'estado': 'exitoso'
    })


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    try:
        usuario = LoginDto(
            email=data['email'],
            password=data['password']
        )   

        exitoso = False
        mensaje = ''
        if usuario.email == 'broker@demo.com' and usuario.password == '654321':
            exitoso = True
            mensaje = 'Inicio sesion correcto'
        else:
            exitoso = False
            mensaje = 'Inicio sesion incorrecto'
        



        return jsonify({
            "exitoso": exitoso,
            "mensaje": mensaje
        }), 200
    except Exception as e:
        error_trace = traceback.format_exc()
        return jsonify({"error": str(error_trace)}), 400


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
