document.getElementById('server-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const ipAddress = document.getElementById('ipAddress').value;
    let port = document.getElementById('port').value || '30120'; // Default port

    // ตรวจสอบว่า IP Address มีการกรอกหรือไม่
    if (!ipAddress) {
        document.getElementById('player-list').innerHTML = '<li class="list-group-item text-center text-danger">โปรดกรอก IP Address</li>';
        return;
    }

    // ส่งคำขอไปยัง backend สำหรับข้อมูลผู้เล่น
    fetch('/get_players', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ipAddress: ipAddress,
            port: port
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('player-list').innerHTML = `<li class="list-group-item text-center text-danger">${data.error}</li>`;
            return;
        }

        updatePlayerList(data); // อัปเดตข้อมูลผู้เล่น
    })
    .catch(error => {
        document.getElementById('player-list').innerHTML = '<li class="list-group-item text-center text-danger">ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้</li>';
    });
});

function updatePlayerList(players) {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = ''; // Clear previous data

    // ตรวจสอบว่ามีผู้เล่นในเซิร์ฟเวอร์หรือไม่
    if (!players || players.length === 0) {
        playerList.innerHTML = '<li class="list-group-item text-center">ไม่มีผู้เล่นในเซิร์ฟเวอร์นี้</li>';
        return;
    }

    // แสดงรายการผู้เล่น
    players.forEach(player => {
        const playerItem = document.createElement('li');
        playerItem.classList.add('list-group-item');
        playerItem.textContent = `ID: ${player.id}, Name: ${player.name}, Ping: ${player.ping}`;
        playerItem.setAttribute('data-player', JSON.stringify(player)); // เก็บข้อมูลผู้เล่นใน attribute

        // เมื่อคลิกที่ผู้เล่น จะแสดงข้อมูลในบล็อกกลาง
        playerItem.addEventListener('click', function () {
            displayPlayerInfo(player);
        });

        playerList.appendChild(playerItem); // เพิ่มผู้เล่นในรายการ
    });
}

function displayPlayerInfo(player) {
    // แสดงข้อมูลผู้เล่นในบล็อกกลาง
    document.getElementById('player-id').textContent = player.id;
    document.getElementById('discord-id').textContent = player.discord_id || 'N/A';
    document.getElementById('discord-username').textContent = player.discord_username || 'N/A';
    document.getElementById('steam-name').textContent = player.name || 'N/A';
    document.getElementById('steam-hex').textContent = player.steam_hex || 'N/A';
    document.getElementById('ping').textContent = player.ping;
}
