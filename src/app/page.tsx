'use client';

import React from 'react';
import Link from 'next/link';
import { useTodos } from '@/contexts/TodoContext';
import { TodoCard } from '@/components/TodoCard';

export default function Home() {
  const { todos } = useTodos();

  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const highPriorityTodos = todos.filter(todo => todo.priority === 'high' && !todo.completed);
  const overdueTodos = todos.filter(todo =>
    todo.dueDate &&
    todo.dueDate < new Date() &&
    !todo.completed
  );

  const recentTodos = [...todos]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to your Todo Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Stay organized and get things done efficiently
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">📋</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Todos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {todos.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {pendingTodos.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {completedTodos.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">🚨</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Overdue
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {overdueTodos.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Todo
          </Link>
          <Link
            href="/todos"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View All Todos
          </Link>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* High Priority Todos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              🔥 High Priority
            </h2>
            {highPriorityTodos.length > 3 && (
              <Link href="/todos" className="text-sm text-blue-600 hover:text-blue-500">
                View all
              </Link>
            )}
          </div>
          <div className="space-y-4">
            {highPriorityTodos.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No high priority todos! 🎉</p>
              </div>
            ) : (
              highPriorityTodos.slice(0, 3).map(todo => (
                <TodoCard key={todo.id} todo={todo} />
              ))
            )}
          </div>
        </div>

        {/* Recent Todos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              📅 Recent Todos
            </h2>
            {todos.length > 3 && (
              <Link href="/todos" className="text-sm text-blue-600 hover:text-blue-500">
                View all
              </Link>
            )}
          </div>
          <div className="space-y-4">
            {todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No todos yet. Create your first one!</p>
                <Link
                  href="/create"
                  className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  Create Todo →
                </Link>
              </div>
            ) : (
              recentTodos.map(todo => (
                <TodoCard key={todo.id} todo={todo} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Overdue Section */}
      {overdueTodos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            ⚠️ Overdue Todos
          </h2>
          <div className="space-y-4">
            {overdueTodos.slice(0, 3).map(todo => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
