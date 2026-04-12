import { cn } from '../../utils/helpers'

export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  icon: Icon,
  className = '',
  ...props
}) {
  return (
    <div className={cn('mb-4', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={cn(
            'w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 focus:bg-white',
            'placeholder:text-gray-400',
            Icon && 'pl-10',
            error && 'border-red-400 focus:ring-red-500/30 focus:border-red-500'
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Textarea variant ───
Input.Textarea = function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  rows = 4,
  className = '',
  ...props
}) {
  return (
    <div className={cn('mb-4', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className={cn(
          'w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm',
          'transition-all duration-200 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 focus:bg-white',
          'placeholder:text-gray-400',
          error && 'border-red-400'
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}

// ─── Select variant ───
Input.Select = function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Chọn...',
  error,
  required = false,
  className = ''
}) {
  return (
    <div className={cn('mb-4', className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={cn(
          'w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm',
          'transition-all duration-200 appearance-none',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 focus:bg-white',
          error && 'border-red-400'
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
