import { useParams } from 'react-router-dom'
import { PATIENT_PROCESS_FLOW_BY_SLUG } from '../utils/constants'
import BookingGuidePage from './BookingGuidePage'
import PatientFAQPage from './PatientFAQPage'
import PatientProcessFlowPage from './PatientProcessFlowPage'
import NotFoundPage from './NotFoundPage'

export default function PatientGuideSlugRouter() {
  const { slug } = useParams()

  if (slug === 'dat-lich-kham') return <BookingGuidePage />
  if (slug === 'hoi-dap-chung') return <PatientFAQPage />
  if (slug && PATIENT_PROCESS_FLOW_BY_SLUG[slug]) return <PatientProcessFlowPage />

  return <NotFoundPage />
}
