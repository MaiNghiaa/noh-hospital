import Header from './Header'
import LayoutHero from './LayoutHero'
import WebsitePartnerLinks from './WebsitePartnerLinks'
import Footer from './Footer'
import ScrollToTop from '../common/ScrollToTop'
import { Outlet } from 'react-router-dom'

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Header />
      {/* Hero giống trang chủ (ảnh + MainNav overlay + tiêu đề/CTA) — mọi route */}
      <LayoutHero />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  )
}
