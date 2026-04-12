import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '../components/common/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-display font-bold text-gradient mb-4">404</div>
        <h1 className="font-display text-2xl font-bold text-hospital-dark mb-3">
          Không tìm thấy trang
        </h1>
        <p className="text-gray-500 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button variant="accent" icon={Home}>Trang chủ</Button>
          </Link>
          <Button variant="secondary" icon={ArrowLeft} onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  )
}
