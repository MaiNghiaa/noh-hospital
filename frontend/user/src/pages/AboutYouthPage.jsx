import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { ABOUT_YOUTH_UNION } from '../utils/constants'

const d = ABOUT_YOUTH_UNION
const h2 = 'font-display text-xl font-bold text-[#1e5691] sm:text-2xl'
const prose = 'text-[15px] leading-relaxed text-gray-800 sm:text-base sm:leading-[1.75]'

export default function AboutYouthPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="transition-colors hover:text-hospital-teal">
            Trang chủ
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link to="/gioi-thieu" className="transition-colors hover:text-hospital-teal">
            Giới thiệu
          </Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="font-semibold text-gray-800">{d.title}</span>
        </nav>

        <h1 className="font-display mb-8 text-center text-2xl font-bold text-[#1e5691] sm:text-3xl">
          {d.title}
        </h1>

        <article className="dept-card-appear rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200/80 sm:p-8">
          <p className={`text-justify font-semibold text-gray-900 ${prose}`}>{d.intro}</p>

          <figure className="mt-8 overflow-hidden rounded-lg">
            <img
              src={d.image}
              alt=""
              className="block w-full h-auto"
              loading="eager"
            />
          </figure>

          <h2 className={`${h2} mt-10`}>{d.officersTitle}</h2>
          <ol className={`mt-5 list-decimal space-y-2.5 pl-5 text-justify ${prose}`}>
            {d.officers.map((o) => (
              <li key={o.name}>
                <span className="font-medium">Đồng chí {o.name}</span>
                <span className="text-gray-600"> — {o.role}</span>
              </li>
            ))}
          </ol>

          <div className={`mt-8 space-y-4 text-justify ${prose}`}>
            {d.overviewParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <h2 className={`${h2} mt-10`}>{d.leadershipTitle}</h2>
          <div className={`mt-5 space-y-6 ${prose}`}>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Bí thư</h3>
              <ul className="space-y-2 pl-1">
                {d.leadershipSecretaries.map((row) => (
                  <li key={row.name}>
                    <span className="font-medium">Đồng chí {row.name}</span>
                    <span className="text-gray-600"> ({row.period})</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Phó Bí thư</h3>
              <ul className="space-y-2 pl-1">
                {d.leadershipDeputies.map((row) => (
                  <li key={row.name}>
                    <span className="font-medium">Đồng chí {row.name}</span>
                    <span className="text-gray-600"> ({row.period})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className={`${h2} mt-10`}>{d.functionsTitle}</h2>
          <ul className={`mt-5 list-disc space-y-4 pl-5 text-justify ${prose}`}>
            {d.functions.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h2 className={`${h2} mt-10`}>{d.achievementsTitle}</h2>
          <div className={`mt-5 space-y-4 text-justify ${prose}`}>
            {d.achievements.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
