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
  const [time, setTime] = useState('');/* a */

  const [recentlyAdded,setRecentlyAdded] = useState(()=>{
    try{
      return JSON.parse(localStorage.getItem('recentlyAdded')) || [];

    } catch{return [];}
  });

  const [recentlyDeleted,setRecentlyDeleted] = useState (()=>{
    try {
      return JSON.parse(localStorage.getItem('recentlyDeleted')) || [];
    } catch{return [];}
  });

  const [dark,setDark] = useState(()=>{
    return localStorage.getItem('theme') === 'dark';
  });

    useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);


    useEffect(() => {                                          
    localStorage.setItem('recentlyAdded', JSON.stringify(recentlyAdded)); 
  }, [recentlyAdded]); 

    useEffect(() => {                                          
    localStorage.setItem('theme',dark ? 'dark' : 'light'); 
  }, [dark]);   


  useEffect(() => {
    localStorage.setItem('tasks',JSON.stringify(tasks));
  }, [tasks]);

  function makeDue(dateStr, timeStr) {
    if (!dateStr) return null; 
    const t = timeStr || '00:00';

    return `${dateStr}T${t}`;
  }

  function sortTasks(list) {
  const copy = list.slice();

  copy.sort((ax, bx) => {
    if (!ax.due && !bx.due) {
      return 0;
    }
    if (!ax.due) {
      return 1;
    }

    if (!bx.due) {
      return -1;
    }
    const aTime = new Date(ax.due).getTime();
    const bTime = new Date(bx.due).getTime();
    return aTime - bTime;
  });

  return copy;
}

  function addTask(e) {
    e.preventDefault();

    const title = text.trim();
      if (!title) return;
      
      const newTask = {
        id : Date.now(),
        title,
        due: makeDue(date,time),
        done : false,
      };
/*       newTask.id = Date.now()
      newTask.title =  title
      if (date) {
        newTask.due = date
      } else {
        newTask.due = null
      }
      newTask.done = false */


      setTasks(prev => sortTasks([newTask, ...prev]));
      
      setRecentlyAdded(prev => {
        const next = [newTask, ...prev].slice(0, 5);
        return next;
      });
      setText('');
      setDate('');
      setTime('');
  }
  

  function toggleDone(id) {
    setTasks(prev => prev.map(tasks => (tasks.id === id ? { ...tasks, done: !tasks.done } : tasks)));
  }
/*   function removeTask(id) {
    setTasks(prev => prev.filter(tasks => tasks.id !== id));
  } */

  function removeTask(id) {
    setTasks(prev => {
      const found = prev.find(p => p.id === id);
      if (found) {
        setRecentlyDeleted(r => [{ ...found, deletedAt: Date.now() }, ...r].slice(0, 5));
        }
      return prev.filter(t => t.id !== id);
    });
  }

  // dont consider this as a feature, but a basic button to delete all the tasks completed (would need prof's suggestion)
  function clearTasks() {
    setTasks([]);
  }

  function clearRecentlyDeleted() {
    setRecentlyDeleted([]);
  }

  // toggle bw themes
  function toggleTheme() {
    setDark(d => !d);
  }
  const remaining = tasks.filter(tasks => !tasks.done).length;
  const rootClass = dark ? 'app-root dark' : 'app-root';
  function clearCompleted() {
  setTasks(prev => prev.filter(t => !t.done));
}

  return (
    <div className={rootClass}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between ">
                <h3 className="card-title ">To-Do</h3>
                <div>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={toggleTheme}
                  >
                    {dark ? 'Light' : 'Dark'}
                  </button>
                </div>
              </div>


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
                <div className="col-sm-2">
                  <input
                    type="time"
                    className="form-control"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                  />
                </div>

                <div className="col-sm-2 d-grid">
                  <button className="btn btn-primary" type="submit">Add</button>
                </div>
              </form>
          
              <div className="d-flex justify-content-between align-items-center">
                <small >{remaining} remaining</small>
                <div className="btn-group">
                <button
                  className="btn btn-outline-danger"
                  type="button"
                    onClick={clearCompleted}>
                    Clear All
                  </button>
                </div>
              </div>

              <ul className="list-group">
                {tasks.length === 0 && (
                  <li className="list-group-item text-muted">No tasks added so far </li>
                )}

                {tasks.map(task => (
                  <li key={task.id} className="justify-content-between ">
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
              {recentlyAdded.length > 0 && (
              <div>
                <h6 >Recently added</h6>
                <ul>
                  {recentlyAdded.map(item => (
                    <li key={item.id} className="small">
                      {item.title}
                    </li>
                  ))}

                </ul>
              </div>
              )}
              

              {recentlyDeleted.length > 0 && (
                <div >
                  <h6 >Recently deleted tasks</h6>
                  <ul>
                    {recentlyDeleted.map(item => (
                      <li key={item.id}>
                        <div>
                          {item.title}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}