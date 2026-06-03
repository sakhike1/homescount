/** Public social profiles — update handles when accounts go live. */
export const SOCIAL_LINKS = [
  {
    id: 'instagram',
    label: 'Homescount on Instagram',
    href: 'https://www.instagram.com/homescount',
  },
  {
    id: 'facebook',
    label: 'Homescount on Facebook',
    href: 'https://www.facebook.com/homescount',
  },
  {
    id: 'x',
    label: 'Homescount on X',
    href: 'https://x.com/homescount',
  },
  {
    id: 'youtube',
    label: 'Homescount on YouTube',
    href: 'https://www.youtube.com/@homescount',
  },
  {
    id: 'linkedin',
    label: 'Homescount on LinkedIn',
    href: 'https://www.linkedin.com/company/homescount',
  },
] as const

export type SocialId = (typeof SOCIAL_LINKS)[number]['id']
