import time
import threading
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print('Client Connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client Disconnected')

@socketio.on('set_timer')
def handle_set_timer(data):
    time_remaining = data['time']

    def countdown(time_remaining):
        while time_remaining > 0:
            print(f"Emitting time: {time_remaining}")  
            socketio.emit('timer', time_remaining)
            time.sleep(1)
            time_remaining -= 1
        socketio.emit('timer', 0) 

    thread = threading.Thread(target=countdown, args=(time_remaining,))
    thread.start()

if __name__ == '__main__':
    socketio.run(app, debug=True)
