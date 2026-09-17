import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const LandingPage = lazy(() => import('../pages/LandingPage').then((module) => ({ default: module.LandingPage })));
const HomePage = lazy(() => import('../pages/HomePage').then((module) => ({ default: module.HomePage })));
const DiscoverPage = lazy(() => import('../pages/DiscoverPage').then((module) => ({ default: module.DiscoverPage })));
const MoviesPage = lazy(() => import('../pages/MoviesPage').then((module) => ({ default: module.MoviesPage })));
const SeriesPage = lazy(() => import('../pages/SeriesPage').then((module) => ({ default: module.SeriesPage })));
const SearchPage = lazy(() => import('../pages/SearchPage').then((module) => ({ default: module.SearchPage })));
const TitleDetailsPage = lazy(() => import('../pages/TitleDetailsPage').then((module) => ({ default: module.TitleDetailsPage })));
const WatchPage = lazy(() => import('../pages/WatchPage').then((module) => ({ default: module.WatchPage })));
const MySpacePage = lazy(() => import('../pages/MySpacePage').then((module) => ({ default: module.MySpacePage })));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage').then((module) => ({ default: module.NotificationsPage })));
const AccountPage = lazy(() => import('../pages/AccountPage').then((module) => ({ default: module.AccountPage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const HelpPage = lazy(() => import('../pages/HelpPage').then((module) => ({ default: module.HelpPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#080B14] text-sm text-[#22D3EE]">Loading RitzlaPlay…</div>}>
      <Routes>
      {/* 1. Marketing Landing / Splash */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. Retired authentication URLs */}
      <Route path="/signin" element={<Navigate to="/home" replace />} />
      <Route path="/signup" element={<Navigate to="/home" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/home" replace />} />

      {/* 3. Redirects for retired routes */}
      <Route path="/plans" element={<Navigate to="/home" replace />} />
      <Route path="/profiles" element={<Navigate to="/account" replace />} />

      {/* 4. Core Discovery & Catalog */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/series" element={<SeriesPage />} />
      <Route path="/search" element={<SearchPage />} />

      {/* 5. Detail & Real Video Stream Player */}
      <Route path="/title/:id" element={<TitleDetailsPage />} />
      <Route path="/watch/:id" element={<WatchPage />} />

      {/* 6. User Space, Notifications, Settings */}
      <Route path="/my-space" element={<MySpacePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/account" element={<Navigate to="/settings" replace />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/help" element={<HelpPage />} />

      {/* 8. 404 Route */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
