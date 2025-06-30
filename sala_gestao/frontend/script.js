let currentRoom = null;

document.addEventListener('DOMContentLoaded', listRooms);

async function createRoom() {
    const name = document.getElementById('roomName').value.trim();
    if (!name) return alert('Digite o nome da sala.');

    const res = await fetch('/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) listRooms();
}

async function accessRoom() {
    const roomName = document.getElementById('accessRoom').value.trim();
    const code = document.getElementById('accessCode').value.trim();
    if (!roomName || !code) return alert('Preencha os campos de acesso.');

    const res = await fetch('/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_name: roomName, code })
    });

    const data = await res.json();
    alert(data.message || data.error);
}

async function deleteRoom(name) {
    if (!confirm(`Deseja excluir a sala "${name}"?`)) return;

    const res = await fetch(`/rooms/${name}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message || data.error);

    listRooms();
    clearCodes();
}

async function listRooms() {
    const res = await fetch('/rooms');
    const rooms = await res.json();

    const ul = document.getElementById('roomList');
    ul.innerHTML = '';

    rooms.forEach(({ name }) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${name}</strong>
            <button onclick="listCodes('${name}')">Ver Códigos</button>
            <button onclick="deleteRoom('${name}')">Excluir Sala</button>
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

    if (!codes.length) {
        section.innerHTML += '<p>Nenhum código cadastrado.</p>';
    } else {
        const ul = document.createElement('ul');
        codes.forEach(({ code, alias }) => {
            const li = document.createElement('li');
            li.innerHTML = `
                Código: <strong>${code}</strong> | Apelido: ${alias || 'sem apelido'}
                <button onclick="deleteCode('${roomName}', '${code}')">Excluir Código</button>
            `;
            ul.appendChild(li);
        });
        section.appendChild(ul);
    }

    document.getElementById('codeForm').style.display = 'block';
}

async function deleteCode(roomName, code) {
    if (!confirm(`Deseja excluir o código "${code}"?`)) return;

    const res = await fetch(`/rooms/${roomName}/codes/${code}`, {
        method: 'DELETE'
    });

    const data = await res.json();
    alert(data.message || data.error);

    listCodes(roomName);
}

function clearCodes() {
    document.getElementById('codeSection').innerHTML = '';
    document.getElementById('codeForm').style.display = 'none';
    currentRoom = null;
}

async function addCode() {
    if (!currentRoom) return alert('Nenhuma sala selecionada.');

    const alias = document.getElementById('newAlias').value.trim();
    const res = await fetch(`/rooms/${currentRoom}/codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alias })
    });

    const data = await res.json();
    alert(data.message || data.error);
    if (res.ok) listCodes(currentRoom);
}