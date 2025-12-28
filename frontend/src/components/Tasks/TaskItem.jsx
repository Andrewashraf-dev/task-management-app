import React, { useState } from 'react';
import { taskAPI } from '../../servcies/api/api';
import TaskForm from './TaskForm';

const TaskItem = ({ task, onTaskUpdated, onTaskDeleted }) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        try {
            const response = await taskAPI.updateTask(task.id, { status: newStatus });
            onTaskUpdated(response.data.task);
        } catch (err) {
            setError('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }

        setLoading(true);
        try {
            await taskAPI.deleteTask(task.id);
            onTaskDeleted(task.id);
        } catch (err) {
            setError('Failed to delete task');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'done': return 'status-done';
            case 'in_progress': return 'status-in-progress';
            default: return 'status-pending';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (showEditForm) {
        return (
            <div className="task-item edit-mode">
                <TaskForm
                    initialData={task}
                    onTaskCreated={(updatedTask) => {
                        onTaskUpdated(updatedTask);
                        setShowEditForm(false);
                    }}
                />
                <button 
                    onClick={() => setShowEditForm(false)}
                    className="btn-secondary"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <div className={`task-item ${getStatusColor(task.status)}`}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="task-header">
                <h4>{task.title}</h4>
                <span className="task-date">
                    Created: {formatDate(task.created_at)}
                </span>
            </div>
            
            {task.description && (
                <p className="task-description">{task.description}</p>
            )}
            
            <div className="task-footer">
                <div className="task-status">
                    <label>Status:</label>
                    <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={loading}
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>
                
                <div className="task-actions">
                    <button 
                        onClick={() => setShowEditForm(true)}
                        disabled={loading}
                        className="btn-edit"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={handleDelete}
                        disabled={loading}
                        className="btn-delete"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;