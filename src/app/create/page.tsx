'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { TodoForm } from '@/components/TodoForm';

export default function CreateTodoPage() {
  const router = useRouter();

  const handleSubmit = () => {
    // Redirect to home after successful creation
    router.push('/');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create New Todo
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add a new task to stay organized and productive
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto">
        <TodoForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>

      {/* Tips Section */}
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-3">
            💡 Tips for Better Todo Management
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use clear, actionable titles (e.g., &quot;Call client about project update&quot;)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Set realistic due dates to avoid overwhelming yourself</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use high priority sparingly - reserve it for truly urgent tasks</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Add descriptions for complex tasks to provide context later</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
