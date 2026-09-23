import React from 'react';
import { Heart, Search, BellOff } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = Search,
  title = "No Matches Found",
  description = "Try adjusting your search criteria or resetting filters to see more compatible profiles.",
  actionText,
  onAction
}) => {
  return (
    <div className="bg-white rounded-2xl border border-rose-100 p-10 text-center max-w-md mx-auto my-8 shadow-xs">
      <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-maroon-600">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-dark-800 mb-2">{title}</h3>
      <p className="text-sm text-muted-500 mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="secondary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  );
};
export default EmptyState;
