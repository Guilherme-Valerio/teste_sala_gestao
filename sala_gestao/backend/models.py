from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Room(db.Model):
    __tablename__ = 'rooms'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    # Um quarto pode ter vários códigos de acesso.
    codes = db.relationship(
        'AccessCode',
        backref='room',
        cascade="all, delete-orphan",  # garante que códigos órfãos também sejam removidos
        lazy='joined'
    )

    def __repr__(self):
        return f"<Room id={self.id} name='{self.name}'>"


class AccessCode(db.Model):
    __tablename__ = 'access_codes'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(36), unique=True, nullable=False)  # UUID
    alias = db.Column(db.String(80), nullable=True)

    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)

    __table_args__ = (
        db.UniqueConstraint('alias', 'room_id', name='unique_alias_per_room'),
    )

    def __repr__(self):
        return f"<AccessCode code='{self.code}' alias='{self.alias}' room_id={self.room_id}>"
