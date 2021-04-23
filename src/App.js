import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  const URL = 'http://localhost:5000/tasks';

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer)
    }
    getTasks();
  }, [])

  // Fetch Tasks From server
  const fetchTasks = async () => {
    const response = await fetch(URL)
    const data = response.json();
    return data
  }

  // Fetch Task 
  const fetchTask = async (id) => {
    const response = await fetch(`${URL}/${id}`)
    const data = response.json();
    return data
  }

  // Add task
  const addTask = async(task) => {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await response.json()

    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])
  }

  // Delete Task
  const deleteTask = async(id) => {
    await fetch(`${URL}/${id}`, {
      method: 'DELETE'
    })

    setTasks(tasks.filter((task) => task.id !== id ))
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updTask = {...taskToToggle, reminder: !taskToToggle.reminder}
    const response = await fetch(`${URL}/${id}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await response.json()

    setTasks(
      tasks.map((task) => (
        task.id === id ? { ...task, reminder: data.reminder } : task
      ))
    )
  }

  return (
    <Router>
      <div className="container">
        <Header 
          onAdd={() => setShowAddTask(!showAddTask) } 
          showAdd={showAddTask}
        />
        <Route path='/' exact render={ (props) => (
          <>
            { showAddTask && <AddTask onAdd={addTask} /> }
            {tasks.length > 0 ? (
            <Tasks 
                tasks={tasks} 
                onDelete={deleteTask}
                onToggle={toggleReminder}
              />) : ('No Tasks')
            }
          </>
        )}/>
        <Route path='/about' component={About} />
        <Footer />
      </div>  
    </Router>
  );
}

export default App;
