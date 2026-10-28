import { createRoot } from 'react-dom/client'
import { HomePage } from '~/components/site/HomePage'
import '~/styles/app.css'

createRoot(document.getElementById('root')!).render(<HomePage />)
