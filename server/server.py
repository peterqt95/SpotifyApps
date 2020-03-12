from app import app, db
from app.models import User
from livereload import Server, shell

if __name__ == "__main__":
    # app.secret_key = "super secret key"
    app.run(debug=True)
    # app.config['DEBUG'] = True
    # app.debug = True
    # server = Server(app.wsgi_app)
    # server.serve()