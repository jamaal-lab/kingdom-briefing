import { createRoot } from 'react-dom/client'
import { WebsitesPage } from '~/websites/WebsitesPage'
import '~/styles/app.css'

createRoot(document.getElementById('root')!).render(<WebsitesPage />)
