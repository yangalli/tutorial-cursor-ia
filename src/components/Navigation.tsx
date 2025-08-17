'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTodos } from '@/contexts/TodoContext';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { todos } = useTodos();

  const isActive = (path: string) => pathname === path;

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                📝 Todo App
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`${isActive('/')
                    ? 'border-blue-500 text-gray-900 dark:text-gray-100'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                Home
                {pendingCount > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                    {pendingCount}
                  </span>
                )}
              </Link>
              <Link
                href="/create"
                className={`${isActive('/create')
                    ? 'border-blue-500 text-gray-900 dark:text-gray-100'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                Create Todo
              </Link>
              <Link
                href="/todos"
                className={`${isActive('/todos')
                    ? 'border-blue-500 text-gray-900 dark:text-gray-100'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
              >
                All Todos
                {todos.length > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-200">
                    {todos.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {completedCount} completed, {pendingCount} pending
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`${isActive('/')
                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
          >
            Home
            {pendingCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                {pendingCount}
              </span>
            )}
          </Link>
          <Link
            href="/create"
            className={`${isActive('/create')
                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
          >
            Create Todo
          </Link>
          <Link
            href="/todos"
            className={`${isActive('/todos')
                ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
          >
            All Todos
            {todos.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-gray-700 dark:text-gray-200">
                {todos.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};
