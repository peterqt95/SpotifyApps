import os
import cx_Oracle
import datetime

host = "localhost"
port = "1521"
SID = "orcl"
user = "system"
password = "kittyboy1"
sid = cx_Oracle.makedsn(host, port, SID)

# 'postgres',
#     'pw': 'kittyboy1',
#     'db': 'spotify-flask',
#     'host': 'localhost',
#     'port': '5432',

POSTGRES_USER = "postgres"
POSTGRES_PW = "kittyboy1"
POSTGRES_DB = "spotify-flask"
POSTGRES_HOST = "localhost"
POSTGRES_PORT = "5432"

class Config(object):
    # SQLALCHEMY_DATABASE_URI = "oracle://{user}:{password}@{sid}".format(
    #     user = user,
    #     password = password,
    #     sid = sid
    # )

    SQLALCHEMY_DATABASE_URI = "postgresql://{user}:{password}@{host}:{port}/{db}".format(
        user = POSTGRES_USER,
        password = POSTGRES_PW,
        host = POSTGRES_HOST,
        port = POSTGRES_PORT,
        db = POSTGRES_DB
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "super secret key"
    JWT_SECRET_KEY = SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(days=14)
    # JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(minutes=1)
    SPOTIFY_CLIENT_ID = "3035f03a789149968ccf80e5f0a824f4"
    SPOTIFY_CLIENT_SECRET = "3f200238bff34b9db8baa3b69bbb2f09"
    SPOTIFY_REDIRECT_URI = "http://localhost:4200/home"