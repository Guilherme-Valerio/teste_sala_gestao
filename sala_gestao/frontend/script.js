
let currentRoom = null;

async function createRoom() {
    const name = document.getElementById('roomName').value;
    const res = await fetch('/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    const data = await res.json();
    alert(data.message || data.error);
    listRooms();
}

async function accessRoom() {
    const room_name = document.getElementById('accessRoom').value;
    const code = document.getElementById('accessCode').value;
    const res = await fetch('/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_name, code })
    });
    const data = await res.json();
    alert(data.message || data.error);
}

async function deleteRoom(name) {
    await fetch(`/rooms/${name}`, { method: 'DELETE' });
    listRooms();
    clearCodes();
}

async function listRooms() {
    const res = await fetch('/rooms');
    const rooms = await res.json();
    const ul = document.getElementById('roomList');
    ul.innerHTML = '';
    rooms.forEach(r => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${r.name}</strong>
            <button onclick="listCodes('${r.name}')">Ver Códigos</button>
            <button onclick="deleteRoom('${r.name}')">Excluir Sala</button>
        `;
        ul.appendChild(li);
    });
}

async function listCodes(roomName) {
    currentRoom = roomName;
    const res = await fetch(`/rooms/${roomName}/codes`);
    const codes = await res.json();
    const section = document.getElementById('codeSection');
    section.innerHTML = `<h3>Códigos da sala "${roomName}"</h3>`;
    if (codes.length === 0) {
        section.innerHTML += '<p>Nenhum código cadastrado.</p>';
    } else {
        const ul = document.createElement('ul');
        codes.forEach(c => {
            const li = document.createElement('li');
            li.innerHTML = `
                Código: <strong>${c.code}</strong> | Apelido: ${c.alias || 'sem apelido'}
                <button onclick="deleteCode('${roomName}', '${c.code}')">Excluir Código</button>
            `;
            ul.appendChild(li);
        });
        section.appendChild(ul);
    }
    document.getElementById('codeForm').style.display = 'block';
}

async function deleteCode(roomName, code) {
    await fetch(`/rooms/${roomName}/codes/${code}`, { method: 'DELETE' });
    listCodes(roomName);
}

function clearCodes() {
    document.getElementById('codeSection').innerHTML = '';
    document.getElementById('codeForm').style.display = 'none';
}

async function addCode() {
    const alias = document.getElementById('newAlias').value;
    const res = await fetch(`/rooms/${currentRoom}/codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alias })
    });
    const data = await res.json();
    alert(data.message || data.error);
    listCodes(currentRoom);
}

window.onload = listRooms;
