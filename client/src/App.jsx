import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Route Guards & Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute, AdminRoute } from './components/routes/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { FeaturesPage } from './pages/public/FeaturesPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { PricingPage } from './pages/public/PricingPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { FAQPage } from './pages/public/FAQPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { ForbiddenPage } from './pages/public/ForbiddenPage';

// Candidate Pages
import { Dashboard } from './pages/candidate/Dashboard';
import { Profile } from './pages/candidate/Profile';
import { ResumeManager } from './pages/candidate/ResumeManager';
import { CreateInterview } from './pages/candidate/CreateInterview';
import { InterviewRoom } from './pages/candidate/InterviewRoom';
import { InterviewReport } from './pages/candidate/InterviewReport';
import { InterviewHistory } from './pages/candidate/InterviewHistory';
import { PracticeMode } from './pages/candidate/PracticeMode';
import { Bookmarks } from './pages/candidate/Bookmarks';
import { PerformanceAnalytics } from './pages/candidate/PerformanceAnalytics';
import { Settings } from './pages/candidate/Settings';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageQuestions } from './pages/admin/ManageQuestions';
import { ManageCategories } from './pages/admin/ManageCategories';
import { ManageJobRoles } from './pages/admin/ManageJobRoles';
import { ManageAIPrompts } from './pages/admin/ManageAIPrompts';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                border: '1px solid #334155',
                borderRadius: '0.75rem',
                fontSize: '13px'
              }
            }}
          />
          <Routes>
            {/* Public Layout Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/403" element={<ForbiddenPage />} />
            </Route>

            {/* Candidate Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/resume" element={<ResumeManager />} />
                <Route path="/interviews" element={<InterviewHistory />} />
                <Route path="/interviews/create" element={<CreateInterview />} />
                <Route path="/interviews/:id" element={<InterviewRoom />} />
                <Route path="/interviews/:id/report" element={<InterviewReport />} />
                <Route path="/practice" element={<PracticeMode />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/analytics" element={<PerformanceAnalytics />} />
                <Route path="/settings" element={<Settings />} />

                {/* Admin Nested Routes (Protected by AdminRole) */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<ManageUsers />} />
                  <Route path="/admin/questions" element={<ManageQuestions />} />
                  <Route path="/admin/categories" element={<ManageCategories />} />
                  <Route path="/admin/job-roles" element={<ManageJobRoles />} />
                  <Route path="/admin/prompts" element={<ManageAIPrompts />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                </Route>
              </Route>
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
