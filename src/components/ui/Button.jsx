import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const Button = forwardRef(({ children, variant = 'neon', size = 'md', loading, className, ...props }, ref) => {
  const variants = {
    neon: 'btn-neon',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: '',
    lg: 'text-lg px-8 py-4',
  };

  return (
    <button
      ref={ref}
      className={cn(variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
