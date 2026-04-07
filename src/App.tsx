import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { CreateGuide } from './pages/CreateGuide';
import { Heroes } from './pages/Heroes';
import { HeroDetail } from './pages/HeroDetail';

// Define our route tree
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true, // This means it renders at the exact '/' path
        element: <Home />,
      },
      {
        path: 'create', // Renders at '/create'
        element: <CreateGuide />,
      },
      {
        path: 'heroes', // Add the new roster route
        element: <Heroes />,
      },
      {
        path: 'heroes/:heroId', // The :heroId matches what we extract in useParams()
        element: <HeroDetail />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;