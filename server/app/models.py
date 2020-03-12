from app import db, ma
from time import time

class User(db.Model):
    __tablename__ = "users"
    myid = db.Column(db.Integer, db.Sequence('user_id_seq'), primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    date_created = db.Column(db.Integer, nullable=False, default=int(time()))

    def __init__(self, name, password):
        self.name = name
        self.password = password
    
    def post(self):
        db.session.add(self)
        db.session.commit()
    
    def put(self, data):
        for key in data:
            if getattr(self, key):
                setattr(self, key, data[key])
        db.session.commit()

class UserSchema(ma.ModelSchema):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.rename_map = {
            "my_id": "myId",
            "date_created": "dateCreated"
        }

    class Meta:
        model = User
    
    def dump(self, *args, **kwargs):
        rename = kwargs.pop("rename", None)
        results = super(UserSchema, self).dump(*args, **kwargs)
        if rename:
            # Adjust remapping if single vs multiple reutnr
            if isinstance(results, list):
                for result in results:
                    for field in result:
                        if field in rename:
                            result[rename[field]] = result.pop(field)
            else:
                for field in results:
                    if field in rename:
                        results[rename[field]] = results.pop(field)
        return results