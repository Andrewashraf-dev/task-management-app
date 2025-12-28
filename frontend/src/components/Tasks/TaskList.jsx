import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { taskAPI } from '../../servcies/api/api';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskAPI.getTasks();
            setTasks(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleTaskCreated = (newTask) => {
        setTasks([newTask, ...tasks]);
        setShowForm(false);
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks(tasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
        ));
    };

    const handleTaskDeleted = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    if (loading) {
        return <div className="loading">Loading tasks...</div>;
    }

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <h2>My Tasks</h2>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                >
                    {showForm ? 'Cancel' : '+ Add Task'}
                </button>
            </div>

            {showForm && (
                <TaskForm onTaskCreated={handleTaskCreated} />
            )}

            {error && <div className="error-message">{error}</div>}

            <div className="tasks-stats">
                <span>Total: {tasks.length}</span>
                <span>Pending: {tasks.filter(t => t.status === 'pending').length}</span>
                <span>In Progress: {tasks.filter(t => t.status === 'in_progress').length}</span>
                <span>Done: {tasks.filter(t => t.status === 'done').length}</span>
            </div>

            <div className="tasks-grid">
                {tasks.length === 0 ? (
                    <div className="no-tasks">
                        <p>No tasks yet. Create your first task!</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onTaskUpdated={handleTaskUpdated}
                            onTaskDeleted={handleTaskDeleted}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskList;