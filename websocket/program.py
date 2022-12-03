import time
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

score = 0
problem = 0


@socketio.on('connect')
def handle_connect():
    print(str(time.time()) + 'received message: connect')
    # time.sleep(3)
    socketio.emit('connect')
    print(str(time.time()) + 'message sent: connect')


@socketio.on('pair')
def handle_pair():
    print(str(time.time()) + 'received message: pair')
    # time.sleep(3)
    # add your username here
    socketio.emit('prepare', ['tester1', 'tester', 'tester3'])
    print(str(time.time()) + 'message sent: prepare')


@socketio.on('start')
def begin_competition():
    global problem
    print(str(time.time()) + 'received message: start')
    socketio.emit('problem', {
        "problemID": problem,
        "content": "wefjwoiefjweoif",
        "type": 0,
        "time": 40,
        "subproblem": [
            {
                "choice": ['few', 'fw', 'af', 'gk'],
            }
        ]
    })
    problem += 1
    print(str(time.time()) + 'message sent: problem')
    socketio.emit('answer', {
        "username": "tester1",
        "correct": [True],
        "score": 8,
    })
    print(str(time.time()) + 'message sent: answer')


@socketio.on('finish')
def receive_finish(id, answers):
    global score, problem
    print(str(time.time()) + 'received message: finish')
    score += 15
    socketio.emit('answer', {
        "username": "tester",
        "correct": [answers[0] == 'C'],
        "score": score,
    })
    print(str(time.time()) + 'message sent: answer')
    socketio.emit('next', {
        "answer": answers,
        "lastQuestion": False,
    })
    print(str(time.time()) + 'message sent: next')
    socketio.emit('problem', {
        "problemID": problem,
        "content": "wefjwoiefjweoif",
        "type": 0,
        "time": 30,
        "subproblem": [
            {
                "choice": ['f1', 'f2', 'f3', 'f4'],
            }
        ]
    })
    socketio.emit('')
    problem += 1
    print(str(time.time()) + 'message sent: problem')
    socketio.emit('answer', {
        "username": "tester1",
        "correct": [True],
        "score": 16,
    })
    print(str(time.time()) + 'message sent: answer')


@socketio.on('result')
def end_competition():
    print(str(time.time()) + 'received message: result')
    socketio.emit('result', {
        "points": [
            {"name": "user3", "points": 38},
            {"name": "user2", "points": 20},
            {"name": "user5", "points": 12},
            {"name": "user1", "points": 58},
            {"name": "user4", "points": 35},
            {"name": "user6", "points": 10},
        ],
        "problems": [
            {
                "num": 0,
                "id": 12345,
                "type": 0,
                "points": [[0], [10], [5], [6], [6], [3]],
            },
            {
                "num": 1,
                "id": 12346,
                "type": 1,
                "points": [
                    [0, 10, 0, 10, 0],
                    [5, 10, 2, 10, 8],
                    [0, 10, 0, 10, 0],
                    [0, 10, 0, 10, 0],
                    [0, 10, 0, 10, 0],
                    [0, 10, 0, 10, 0]
                ],
            },
        ]
    })
    print(str(time.time()) + 'message sent: result')


if __name__ == '__main__':
    socketio.run(app, port=8765)
