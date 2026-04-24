import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, Calendar, Tag, Share2 } from 'lucide-react'
import { formatDate } from '../utils/helpers'
import { newsCategoryLabel } from '../utils/newsDisplay'
import newsService from '../services/newsService'

export default function NewsDetailPage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      try {
        const res = await newsService.getBySlug(slug)
        if (cancelled) return
        setArticle(res.data)
      } catch {
        if (cancelled) return
        setArticle(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Đang tải...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-gray-400">Không tìm thấy bài viết</h2>
          <Link to="/tin-tuc" className="text-hospital-teal mt-4 inline-block font-semibold">
            ← Quay lại tin tức
          </Link>
        </div>
      </div>
    )
  }

  const publishedDate = article.published_at || article.created_at
  const relatedNews = []

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-hospital-teal transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link to="/tin-tuc" className="hover:text-hospital-teal transition-colors">Tin tức</Link>
            <ChevronRight size={14} />
            <span className="text-hospital-dark font-semibold line-clamp-1">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img src={article.image} alt={article.title} className="w-full aspect-[16/9] object-cover" />
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(publishedDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} />
                    {newsCategoryLabel(article.category)}
                  </span>
                </div>

                <h1 className="font-display text-2xl lg:text-3xl font-bold text-hospital-dark leading-snug">
                  {article.title}
                </h1>

                <div className="mt-6 text-gray-600 leading-relaxed space-y-4 prose prose-sm max-w-none">
                  {article.excerpt && <p>{article.excerpt}</p>}
                  {article.content ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  ) : null}
                  <p>
                    Bệnh viện Tai Mũi Họng Trung ương luôn tiên phong trong công tác chăm sóc sức khỏe
                    cộng đồng, đặc biệt là các chương trình khám sàng lọc miễn phí. Các hoạt động này
                    không chỉ giúp phát hiện sớm các bệnh lý Tai Mũi Họng mà còn nâng cao nhận thức
                    của người dân về tầm quan trọng của việc khám sức khỏe định kỳ.
                  </p>
                  <p>
                    Trong khuôn khổ chương trình, các chuyên gia hàng đầu của bệnh viện đã trực tiếp
                    thăm khám, tư vấn và hướng dẫn cho người dân các phương pháp chăm sóc sức khỏe
                    Tai Mũi Họng đúng cách tại nhà. Nhiều trường hợp được phát hiện bệnh lý sớm
                    và được hướng dẫn điều trị kịp thời.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {relatedNews.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="font-display text-lg font-bold text-hospital-dark mb-4">Tin tức liên quan</h3>
                <div className="space-y-4">
                  {relatedNews.map((news) => (
                    <Link key={news.id} to={`/tin-tuc/${news.slug}`} className="group flex gap-3">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-20 h-14 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-hospital-dark line-clamp-2 group-hover:text-hospital-teal transition-colors leading-snug">
                          {news.title}
                        </h4>
                        <span className="text-xs text-gray-400 mt-1">{formatDate(news.published_at || news.created_at)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  )
}
