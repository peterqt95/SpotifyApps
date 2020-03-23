from flask import Flask, request, Blueprint
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import Config
import spotipy
import spotipy.util as util
from spotipy import oauth2

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

api_bp = Blueprint('api', __name__)
api = Api(api_bp)
db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

SCOPE = 'user-library-read user-follow-read'
CACHE = '.spotipyoauthcache'
sp_oauth = oauth2.SpotifyOAuth( 
    app.config["SPOTIFY_CLIENT_ID"], app.config["SPOTIFY_CLIENT_SECRET"], 
    app.config["SPOTIFY_REDIRECT_URI"], scope=SCOPE, cache_path=CACHE
)

from app import models, routes

# Register blueprints
app.register_blueprint(api_bp)