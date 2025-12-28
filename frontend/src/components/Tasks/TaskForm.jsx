import React, { useState } from 'react';
import { taskAPI } from  'src/services/api';

const TaskForm = ({ onTaskCreated, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [status, setStatus] = useState(initialData?.status || 'pending');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const taskData = { title, description, status };
            let response;
            
            if (initialData) {
                response = await taskAPI.updateTask(initialData.id, taskData);
            } else {
                response = await taskAPI.createTask(taskData);
            }

            onTaskCreated(response.data.task);
            if (!initialData) {
                setTitle('');
                setDescription('');
                setStatus('pending');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="task-form">
            <h3>{initialData ? 'Edit Task' : 'Create New Task'}</h3>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskForm;