from sys import implementation
import psutil
import time
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

def get_cpu_usage():
    return psutil.cpu_percent(interval=1)

def get_memory_usage():
    return psutil.virtual_memory().percent
    
def system_metrics():
    cpu_usage = get_cpu_usage()
    memory_usage = get_memory_usage()
    return {
        "cpu_usage": cpu_usage,
        "memory_usage": memory_usage,
        "dbStatus": "Online",
        "timestamp": time.strftime("%H:%M:%S")
    }

def emit_metrics():
    while True:
        metrics = system_metrics()
        print(f"📡 Hardware: CPU {metrics['cpu_usage']}% | RAM {metrics['memory_usage']}%")
        socketio.emit('metrics_update', metrics)
        socketio.sleep(2)

@app.route('/')
def index():
    return "Active"

if __name__ == "__main__":
    print("Initializing real-time monitoring")
    socketio.start_background_task(emit_metrics)
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)