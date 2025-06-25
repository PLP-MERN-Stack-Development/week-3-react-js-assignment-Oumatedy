const fetchTodos = async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export { fetchTodos };

