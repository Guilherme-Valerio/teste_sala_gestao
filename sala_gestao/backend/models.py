from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    codes = db.relationship('AccessCode', backref='room', cascade="all, delete")

class AccessCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(36), unique=True, nullable=False)
    alias = db.Column(db.String(80))
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)

    __table_args__ = (
        db.UniqueConstraint('alias', 'room_id', name='unique_alias_per_room'),
    )
