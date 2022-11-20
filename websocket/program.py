import time
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")


@socketio.on('connect')
def handle_connect():
    print(str(time.time()) + 'received message: connect')
    time.sleep(3)
    socketio.emit('connect')
    print(str(time.time()) + 'message sent: connect')


@socketio.on('pair')
def handle_pair():
    print(str(time.time()) + 'received message: pair')
    time.sleep(3)
    socketio.emit('prepare', ['tester1', 'tester', 'tester3'])  # add your username here
    print(str(time.time()) + 'message sent: prepare')


@socketio.on('start')
def begin_competition():
    print(str(time.time()) + 'received message: start')
    socketio.emit('problem', {
        "title": "sdfs",
        "content": "wefjwoiefjweoif"
    })
    print(str(time.time()) + 'message sent: problem')


@socketio.on('result')
def end_competition():
    print(str(time.time()) + 'received message: result')
    socketio.emit('result', {
        "points": [
            {"name": "user1", "points": 58},
            {"name": "user2", "points": 40},
            {"name": "user3", "points": 38},
            {"name": "user4", "points": 35},
            {"name": "user5", "points": 12},
            {"name": "user6", "points": 10},
        ],
        "problems": [
            {
                "num": 1,
                "id": 12345,
                "title": "这是一道题目。预计在这里显示题型、正确率、平均分",
                "points": [10, 5, 10, 10, 6, 3],
            },
            {
                "num": 2,
                "id": 12346,
                "title": "这是一道题目",
                "points": [7, 10, 7, 10, 7, 10],
            },
            {
                "num": 3,
                "id": 12348,
                "title": "这是一道题目",
                "points": [0, 10, 0, 0, 5, 0],
            },
        ]
    })
    print(str(time.time()) + 'message sent: result')


if __name__ == '__main__':
    socketio.run(app, port=8765)
