import React, { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tasks')) || [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks',JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();

    const title = text.trim();
      if (!title) return;
      
      const newTask = {}
      newTask.id = Date.now()
      newTask.title =  title
      if (date) {
        newTask.due = date
      } else {
        newTask.due = null
      }
      newTask.done = false

      setTasks(prev => [newTask, ...prev]);
      setText('');
      setDate('');
  }

  function toggleDone(id) {
    setTasks(prev => prev.map(tasks => (tasks.id === id ? { ...tasks, done: !tasks.done } : tasks)));
  }
  function removeTask(id) {
    setTasks(prev => prev.filter(tasks => tasks.id !== id));
  }

  // dont consider this as a feature, but a basic button to delete all the tasks completed (would need prof's suggestion)
  function clearTasks() {
    setTasks([]);
  }
  const remaining = tasks.filter(tasks => !tasks.done).length;

  return (
    <div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-3">To-Do</h3>

              <form className="row align-items-center mb-3" onSubmit={addTask}>
                <div className="col-sm-7">
                  <input
                    className="form-control"
                    placeholder="Add a task"
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                </div>

                <div className="col-sm-3">
                  <input
                    type="date"
                    className="form-control"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                </div>

                <div className="col-sm-2 d-grid">
                  <button className="btn btn-primary" type="submit">Add</button>
                </div>
              </form>

              <div className=" d-flex justify-content-between">
                <small className="text-muted">{remaining} remaining</small>
                <div>
                  <button className="btn btn-outline-danger" onClick={clearTasks}>
                    Clear All
                  </button>
                </div>
              </div>

              <ul className="list-group">
                {tasks.length === 0 && (
                  <li className="list-group-item text-muted">No tasks added so far </li>
                )}

                {tasks.map(task => (
                  <li key={task.id} className="d-flex justify-content-between ">
                    <div>
                      <div>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={task.done}
                          onChange={() => toggleDone(task.id)}
                          id={`${task.id}`}
                        />
                        <label
                          className={`form-check-label bg-danger ${task.done ? 'bg-white text-success text-decoration-line-through' : ''}`}
                          htmlFor={`${task.id}`}
                        >
                          {task.title}
                        </label>
                      </div>
                      {task.due && (
                        <small className="d-block ms-4">Due by :- {new Date(task.due).toLocaleDateString()}</small>
                      )}
                    </div>

                    <div>
                      <button className="btn me-2" onClick={() => removeTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

