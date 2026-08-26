import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlayCircle,
  History,
  Target,
  Bookmark,
  BarChart2,
  User,
  Settings,
  LogOut,
  Sparkles,
  Shield,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const candidateNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'New Interview', href: '/interviews/create', icon: PlusCircle, highlight: true },
    { name: 'Resume & AI Analysis', href: '/resume', icon: FileText },
    { name: 'Interview History', href: '/interviews', icon: History },
    { name: 'Practice Mode', href: '/practice', icon: Target },
    { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  const adminNavItems = [
    { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Users', href: '/admin/users', icon: User },
    { name: 'Question Bank', href: '/admin/questions', icon: Target },
    { name: 'Categories', href: '/admin/categories', icon: Bookmark },
    { name: 'Job Roles', href: '/admin/job-roles', icon: FileText },
    { name: 'AI Prompts', href: '/admin/prompts', icon: Sparkles },
    { name: 'Platform Analytics', href: '/admin/analytics', icon: BarChart2 }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2.5 font-bold text-lg">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="bg-gradient-to-r from-slate-900 via-brand-700 to-brand-500 dark:from-white dark:via-brand-200 dark:to-cyan-400 bg-clip-text text-transparent">
            InterviewAI
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Candidate Section */}
        <div>
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Candidate Portal
          </span>
          <nav className="mt-2 space-y-1">
            {candidateNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      item.highlight
                        ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-md shadow-brand-500/20'
                        : isActive
                        ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin Section (Only visible for Admins) */}
        {isAdmin && (
          <div>
            <div className="flex items-center gap-1.5 px-3">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                Admin Panel
              </span>
            </div>
            <nav className="mt-2 space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.href === '/admin'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* User Footer Card */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user?.name || 'Candidate'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate capitalize">
                {user?.role || 'candidate'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
