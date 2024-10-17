from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)


# เส้นทางหลักในการแสดงผลหน้า HTML
@app.route("/")
def index():
    return render_template("index.html")  # แสดงหน้า index.html จากโฟลเดอร์ templates


# API สำหรับดึงข้อมูลผู้เล่นจากเซิร์ฟเวอร์ FiveM
@app.route("/get_players", methods=["POST"])
def get_players():
    ip_address = request.json.get("ipAddress")
    port = request.json.get("port", "30120")  # ถ้าไม่ได้ระบุพอร์ต ใช้ค่าเริ่มต้น 30120

    server_url = f"http://{ip_address}:{port}/players.json"

    try:
        # ส่งคำขอไปยังเซิร์ฟเวอร์ FiveM
        response = requests.get(server_url)
        response.raise_for_status()
        players = response.json()
        return jsonify(players)  # ส่งข้อมูลผู้เล่นกลับไปในรูปแบบ JSON
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500  # ส่งข้อความข้อผิดพลาดกลับไปยัง frontend


if __name__ == "__main__":
    app.run(debug=True)
