import React from 'react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  actionIcon: ActionIcon
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 shadow-sm">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} icon={ActionIcon} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
};
