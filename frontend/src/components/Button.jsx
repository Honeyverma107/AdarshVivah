import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'gold', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  icon: Icon,
  fullWidth = false,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary: 'bg-maroon-600 hover:bg-maroon-700 text-white shadow-md shadow-maroon-900/10 focus:ring-maroon-600',
    secondary: 'bg-rose-50 hover:bg-rose-100 text-maroon-800 border border-rose-200 focus:ring-maroon-600',
    gold: 'bg-gold-500 hover:bg-gold-600 text-dark-900 shadow-md shadow-gold-500/10 focus:ring-gold-500 font-semibold',
    outline: 'border-2 border-maroon-600 text-maroon-600 hover:bg-maroon-600 hover:text-white focus:ring-maroon-600',
    ghost: 'text-dark-800 hover:bg-rose-50 hover:text-maroon-600 focus:ring-maroon-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold'
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      {children}
    </button>
  );
};
export default Button;
