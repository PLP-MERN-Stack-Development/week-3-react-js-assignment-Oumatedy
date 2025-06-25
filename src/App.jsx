import React, { useState, useEffect } from 'react';
import './App.css';
import Button from './components/Button';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Card from './components/Card';
import Layout from './components/Layout';
import TaskManager from './components/TaskManager';
import { fetchTodos } from './api';

// Theme switcher hook
function useDarkMode() {
  const [enabled, setEnabled] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [enabled]);
  return [enabled, setEnabled];
}

function App() {
  const [count, setCount] = useState(0);

  // Theme switcher
  const [darkMode, setDarkMode] = useDarkMode();

  // API data state
  const [apiTodos, setApiTodos] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5;

  // Search state
  const [search, setSearch] = useState('');

  // Fetch API data on mount
  useEffect(() => {
    const loadApiTodos = async () => {
      setApiLoading(true);
      setApiError(null);
      try {
        const data = await fetchTodos();
        setApiTodos(data || []);
      } catch (error) {
        setApiTodos([]);
        setApiError('Failed to fetch API data.');
      } finally {
        setApiLoading(false);
      }
    };
    loadApiTodos();
  }, []);

  // Filtered and paginated todos
  const filteredTodos = apiTodos.filter(todo =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);
  const paginatedTodos = filteredTodos.slice(
    (currentPage - 1) * todosPerPage,
    currentPage * todosPerPage
  );

  // Pagination handlers
  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  // Reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* Theme Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode((v) => !v)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow transition-colors duration-300"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
            <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" /></svg>
          )}
        </button>
      </div>
      <Layout>
        <main className="max-w-4xl mx-auto py-8 px-2 sm:px-4 space-y-8">
          {/* Counter Section */}
          <section className="flex justify-center">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg shadow px-6 py-3 transition-all duration-300">
              <button
                aria-label="Decrease"
                onClick={() => setCount(count - 1)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 transform hover:scale-110"
              >–</button>
              <span className="text-2xl font-semibold">{count}</span>
              <button
                aria-label="Increase"
                onClick={() => setCount(count + 1)}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200 transform hover:scale-110"
              >+</button>
            </div>
          </section>

          {/* Task Manager Section */}
          <section>
            <Card className="shadow-lg">
              <TaskManager />
            </Card>
          </section>

          {/* API Data Section */}
          <section>
            <Card className="shadow-lg">
              <h2 className="text-2xl font-bold mb-2">API Data</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Fetch and display data from an API here.
              </p>
              {/* Search */}
              <div className="mt-4 mb-2">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search todos..."
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none"
                />
              </div>
              {/* API Todos */}
              <div className="mt-2">
                {apiLoading ? (
                  <div className="animate-pulse">Loading API data...</div>
                ) : apiError ? (
                  <div className="text-red-500">{apiError}</div>
                ) : (
                  <>
                    <ul className="text-sm max-h-40 overflow-y-auto bg-gray-100 dark:bg-gray-700 p-2 rounded space-y-1">
                      {paginatedTodos.length > 0 ? (
                        paginatedTodos.map((todo) => (
                          <li
                            key={todo.id}
                            className="transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-blue-900 px-2 py-1 rounded cursor-pointer"
                          >
                            <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                              {todo.title}
                            </span>
                            {todo.completed ? ' (done)' : ''}
                          </li>
                        ))
                      ) : (
                        <li>No API todos found</li>
                      )}
                    </ul>
                    {/* Pagination controls */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-2">
                        <button
                          onClick={handlePrev}
                          disabled={currentPage === 1}
                          className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 transition-all duration-200"
                        >
                          Prev
                        </button>
                        <span>
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={handleNext}
                          disabled={currentPage === totalPages}
                          className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 transition-all duration-200"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </section>
        </main>
        {/* Responsive Footer */}
      </Layout>
    </div>
  );
}

export default App;
