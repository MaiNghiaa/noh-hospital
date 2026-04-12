import { cn } from '../../utils/helpers'

export default function Card({
  children,
  className = '',
  hover = true,
  glass = false,
  padding = true,
  onClick
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl overflow-hidden transition-all duration-300',
        glass ? 'glass-card' : 'bg-white shadow-md border border-gray-100',
        hover && 'hover-lift cursor-pointer',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  )
}

// ─── Card sub-components ───
Card.Image = function CardImage({ src, alt, className = '', aspectRatio = 'aspect-[4/3]' }) {
  return (
    <div className={cn('overflow-hidden', aspectRatio, className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
    </div>
  )
}

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={cn('p-5', className)}>{children}</div>
}

Card.Title = function CardTitle({ children, className = '' }) {
  return (
    <h3 className={cn('font-display text-lg font-bold text-hospital-dark leading-snug', className)}>
      {children}
    </h3>
  )
}

Card.Text = function CardText({ children, className = '' }) {
  return (
    <p className={cn('text-gray-600 text-sm leading-relaxed mt-2', className)}>
      {children}
    </p>
  )
}
