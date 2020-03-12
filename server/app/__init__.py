from flask import Flask, request, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

api_bp = Blueprint('api', __name__)
api = Api(api_bp)
db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

from app import models, routes

# Register blueprints
app.register_blueprint(api_bp)