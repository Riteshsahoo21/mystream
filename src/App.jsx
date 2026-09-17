import React, { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes/AppRoutes';
import { DynamicPageTranslator } from './components/common/DynamicPageTranslator';

const Agentation = lazy(() => import('agentation').then((module) => ({ default: module.Agentation })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DynamicPageTranslator />
        <AppRoutes />
        {import.meta.env.DEV && (
          <Suspense fallback={null}>
            <Agentation />
          </Suspense>
        )}
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
