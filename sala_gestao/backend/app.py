from flask import Flask, request, jsonify, send_from_directory
from models import db, Room, AccessCode
import uuid

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/rooms', methods=['POST'])
def create_room():
    data = request.json or {}
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': 'Room name is required'}), 400
    if Room.query.filter_by(name=name).first():
        return jsonify({'error': 'Room already exists'}), 400
    room = Room(name=name)
    db.session.add(room)
    db.session.commit()
    return jsonify({'message': f'Room "{name}" created'}), 201

@app.route('/rooms', methods=['GET'])
def list_rooms():
    rooms = Room.query.all()
    return jsonify([{'name': r.name} for r in rooms]), 200

@app.route('/rooms/<room_name>', methods=['DELETE'])
def delete_room(room_name):
    room = Room.query.filter_by(name=room_name).first()
    if not room:
        return jsonify({'error': 'Room not found'}), 404
    db.session.delete(room)
    db.session.commit()
    return jsonify({'message': f'Room "{room_name}" deleted'}), 200

@app.route('/rooms/<room_name>/codes', methods=['POST'])
def generate_code(room_name):
    data = request.json or {}
    alias = data.get('alias', '').strip()

    room = Room.query.filter_by(name=room_name).first()
    if not room:
        return jsonify({'error': 'Room not found'}), 404

    if len(room.codes) >= 4:
        return jsonify({'error': 'Room has reached the maximum number of codes'}), 400

    if alias and any(c.alias == alias for c in room.codes):
        return jsonify({'error': 'Alias already exists in this room'}), 400

    code = str(uuid.uuid4())
    access_code = AccessCode(code=code, alias=alias or None, room=room)
    db.session.add(access_code)
    db.session.commit()

    return jsonify({'message': 'Code generated', 'code': code}), 201

@app.route('/rooms/<room_name>/codes', methods=['GET'])
def list_codes(room_name):
    room = Room.query.filter_by(name=room_name).first()
    if not room:
        return jsonify({'error': 'Room not found'}), 404
    return jsonify([
        {'code': c.code, 'alias': c.alias} for c in room.codes
    ]), 200

@app.route('/rooms/<room_name>/codes/<code_id>', methods=['DELETE'])
def delete_code(room_name, code_id):
    room = Room.query.filter_by(name=room_name).first()
    if not room:
        return jsonify({'error': 'Room not found'}), 404
    code = AccessCode.query.filter_by(code=code_id, room=room).first()
    if not code:
        return jsonify({'error': 'Code not found'}), 404
    db.session.delete(code)
    db.session.commit()
    return jsonify({'message': 'Code deleted'}), 200

@app.route('/access', methods=['POST'])
def access_room():
    data = request.json or {}
    room_name = data.get('room_name', '').strip()
    code_input = data.get('code', '').strip()

    room = Room.query.filter_by(name=room_name).first()
    if room and any(c.code == code_input for c in room.codes):
        return jsonify({'message': 'Access granted'}), 200
    return jsonify({'error': 'Invalid room or code'}), 403

@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('../frontend', filename)

if __name__ == '__main__':
    app.run(debug=True)
