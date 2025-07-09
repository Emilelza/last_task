from flask import Flask,render_template,request,jsonify

app = Flask(__name__)

tasks = []
@app.route('/')
def home():
    return render_template('index.html')
@app.route('/tasks', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def tasks_list():
    if request.method == 'GET':
        return jsonify(tasks)
    elif request.method == 'POST':
       data=request.get_json()
       task_name=data.get('task') or data.get('name')
       if task_name:
           task={
               'id':len(tasks),
               'name':task_name,
               'completed':False
           }
           tasks.append(task)
           return jsonify({'message':'Task added','task':task}),201
       return jsonify({'error':'Task name is required'}),400  
@app.route('/tasks/<int:task_id>', methods=['PATCH', 'DELETE'])
def task_detail(task_id):
    if task_id < 0 or task_id >= len(tasks):
        return jsonify({'error': 'Task not found'}), 404

    if request.method == 'PATCH':
        data = request.get_json()
        if 'completed' in data and isinstance(data['completed'], bool):
            tasks[task_id]['completed'] = data['completed']
            return jsonify({'message': 'Task updated', 'task': tasks[task_id]})
        return jsonify({'error': 'Invalid data'}), 400

    elif request.method == 'DELETE':
        deleted_task = tasks.pop(task_id)
        return jsonify({'message': 'Task deleted', 'task': deleted_task})
    return jsonify({'error': 'Method not allowed'}), 405

@app.route('/tasks/save', methods=['POST'])
def save_tasks():
    data = request.get_json()
    if not isinstance(data, list):
        return jsonify({'error': 'Invalid data format'}), 400
    global tasks
    tasks=[
        {
            'id': idx,
            'name': task.get('name', ''),
            'completed': task.get('completed', False)
        } for idx,task in enumerate(data)
    ]
    print("Saved tasks:", tasks)
    return jsonify({'message': 'Tasks saved successfully'}), 200


if __name__ == '__main__':
    app.run(debug=True)
