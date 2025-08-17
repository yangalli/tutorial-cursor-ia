'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Todo, TodoFormData, TodoContextType } from '@/types/todo';

interface StoredTodo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        try {
          const parsedTodos = JSON.parse(savedTodos);
          // Convert date strings back to Date objects
          const todosWithDates = parsedTodos.map((todo: StoredTodo): Todo => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt),
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          }));
          setTodos(todosWithDates);
        } catch (error) {
          console.error('Error parsing saved todos:', error);
        }
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = (todoData: TodoFormData) => {
    const now = new Date();
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      ...todoData,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, ...updates, updatedAt: new Date() }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  };

  const getTodoById = (id: string): Todo | undefined => {
    return todos.find(todo => todo.id === id);
  };

  const contextValue: TodoContextType = {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodoById,
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};
