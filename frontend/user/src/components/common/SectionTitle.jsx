import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function SectionTitle({
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'Xem tất cả',
  centered = false,
  className = ''
}) {
  return (
    <div className={cn(
      'flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8',
      centered && 'items-center text-center sm:flex-col sm:items-center',
      className
    )}>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && (
          <p className="mt-3 text-gray-500 font-body max-w-xl">{subtitle}</p>
        )}
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="inline-flex items-center gap-1.5 text-hospital-teal font-semibold text-sm hover:gap-3 transition-all duration-300 shrink-0"
        >
          {viewAllText}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}
