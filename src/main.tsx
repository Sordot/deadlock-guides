import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';

// Import Mantine core styles
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { theme } from '../theme.ts';

// Create a tanstack query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // By default, React Query refetches when you switch browser tabs. 
      // For large static data, you usually want to turn this off.
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
