/** Public social profiles — update handles when accounts go live. */
export const SOCIAL_LINKS = [
  {
    id: 'instagram',
    label: 'Homescout on Instagram',
    href: 'https://www.instagram.com/Homescout',
  },
  {
    id: 'facebook',
    label: 'Homescout on Facebook',
    href: 'https://www.facebook.com/Homescout',
  },
  {
    id: 'x',
    label: 'Homescout on X',
    href: 'https://x.com/Homescout',
  },
  {
    id: 'youtube',
    label: 'Homescout on YouTube',
    href: 'https://www.youtube.com/@Homescout',
  },
  {
    id: 'linkedin',
    label: 'Homescout on LinkedIn',
    href: 'https://www.linkedin.com/company/Homescout',
  },
] as const

export type SocialId = (typeof SOCIAL_LINKS)[number]['id']
