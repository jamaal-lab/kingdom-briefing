import { TARGET } from '~/lib/target'
import type { ConceptBrand } from './AfterSite'

/** The /websites build always credits Bridge to Better Solutions; elsewhere only when asked (?brand=btbs). */
export function conceptBrand(param?: string): ConceptBrand {
  return TARGET === 'websites' || param === 'btbs' ? 'btbs' : 'bridgeweb'
}
