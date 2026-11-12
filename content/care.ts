/** Public crisis resources. These are national/state services, not church programs. */
export const crisisResources = [
  { name: "Emergency", detail: "Call 911 if you or someone else is in immediate danger.", href: "tel:911", action: "Call 911" },
  {
    name: "988 Suicide & Crisis Lifeline",
    detail: "Free, confidential support 24/7. Call or text 988.",
    href: "tel:988",
    action: "Call or text 988",
  },
  {
    name: "National Domestic Violence Hotline",
    detail: "24/7 support, safety planning and referrals.",
    href: "tel:+18007997233",
    action: "1-800-799-7233",
  },
  {
    name: "Illinois Domestic Violence Hotline",
    detail: "24/7, statewide, multilingual.",
    href: "tel:+18778636338",
    action: "1-877-863-6338",
  },
  {
    name: "NAMI Chicago Helpline",
    detail: "Mental health information and referrals.",
    href: "tel:+18336264244",
    action: "833-626-4244",
  },
] as const;
