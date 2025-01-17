from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

# Serve the main page
@app.route('/')
def index():
    return render_template('index.html')

# Handle drawing data from clients
@socketio.on('draw')
def handle_draw(data):
    emit('broadcast_draw', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)

