'use client';

import React from 'react';
import { Todo } from '@/types/todo';
import { useTodos } from '@/contexts/TodoContext';

interface TodoCardProps {
  todo: Todo;
  showActions?: boolean;
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo, showActions = true }) => {
  const { toggleTodo, deleteTodo } = useTodos();

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50 dark:bg-red-950';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950';
      case 'low':
        return 'border-green-500 bg-green-50 dark:bg-green-950';
    }
  };

  const getPriorityBadgeColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const isOverdue = todo.dueDate && todo.dueDate < new Date() && !todo.completed;

  return (
    <div className={`
      p-4 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow duration-200
      ${getPriorityColor(todo.priority)}
      ${todo.completed ? 'opacity-60' : ''}
      ${isOverdue ? 'ring-2 ring-red-300' : ''}
    `}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {showActions && (
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          )}
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className={`mt-1 text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                {todo.description}
              </p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeColor(todo.priority)}`}>
                {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
              </span>
              {todo.dueDate && (
                <span className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                  Due: {todo.dueDate.toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Created: {todo.createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>
        {showActions && (
          <button
            onClick={() => deleteTodo(todo.id)}
            className="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
            aria-label="Delete todo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
