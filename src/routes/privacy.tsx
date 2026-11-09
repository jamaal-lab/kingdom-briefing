import { createFileRoute } from '@tanstack/react-router'
import { COMPANY } from '~/websites/config'
import { PrivacyPage } from '~/websites/PrivacyPage'

/** /privacy: the project-intake privacy notice (draft, see PrivacyPage). */
export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: `Project intake privacy notice | ${COMPANY.legalName}` },
      { name: 'description', content: `How ${COMPANY.legalName} handles information submitted through the website project intake.` },
    ],
  }),
  component: PrivacyPage,
})
