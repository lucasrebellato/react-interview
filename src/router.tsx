import { createBrowserRouter } from 'react-router-dom';
import HomePage from './modules/todoLists/pages/todosLists';
import TodoListPage from './modules/todos/pages/todos';
import NotFound from './pages/NotFound';
import Layout from './components/layout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'todolists/:id', element: <TodoListPage /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);