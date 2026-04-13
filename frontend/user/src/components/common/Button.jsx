import { cn } from '../../utils/helpers'

const variants = {
  primary: 'bg-gradient-to-r from-hospital-blue to-primary-700 text-white hover:shadow-lg hover:shadow-primary-500/25',
  secondary: 'bg-white text-hospital-blue border-2 border-hospital-blue hover:bg-hospital-light',
  accent: 'bg-gradient-to-r from-hospital-teal to-accent-600 text-white hover:shadow-lg hover:shadow-accent-500/25',
  ghost: 'bg-transparent text-hospital-dark hover:bg-gray-100',
  danger: 'bg-red-500 text-white hover:bg-red-600'
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-body font-semibold transition-all duration-300 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 16 : 20} />
      ) : null}
      {children}
    </button>
  )
}
