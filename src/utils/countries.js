// Country codes to Country Name and Emoji Flag
export const COUNTRY_MAP = {
  bd: { name: 'Bangladesh', flag: '🇧🇩' },
  us: { name: 'United States', flag: '🇺🇸' },
  gb: { name: 'United Kingdom', flag: '🇬🇧' },
  uk: { name: 'United Kingdom', flag: '🇬🇧' },
  in: { name: 'India', flag: '🇮🇳' },
  ca: { name: 'Canada', flag: '🇨🇦' },
  au: { name: 'Australia', flag: '🇦🇺' },
  de: { name: 'Germany', flag: '🇩🇪' },
  fr: { name: 'France', flag: '🇫🇷' },
  es: { name: 'Spain', flag: '🇪🇸' },
  it: { name: 'Italy', flag: '🇮🇹' },
  jp: { name: 'Japan', flag: '🇯🇵' },
  kr: { name: 'South Korea', flag: '🇰🇷' },
  pk: { name: 'Pakistan', flag: '🇵🇰' },
  ua: { name: 'Ukraine', flag: '🇺🇦' },
  tr: { name: 'Turkey', flag: '🇹🇷' },
  br: { name: 'Brazil', flag: '🇧🇷' },
  sa: { name: 'Saudi Arabia', flag: '🇸🇦' },
  ae: { name: 'UAE', flag: '🇦🇪' },
  nl: { name: 'Netherlands', flag: '🇳🇱' },
  ru: { name: 'Russia', flag: '🇷🇺' },
  mx: { name: 'Mexico', flag: '🇲🇽' },
  ar: { name: 'Argentina', flag: '🇦🇷' },
  id: { name: 'Indonesia', flag: '🇮🇩' },
  my: { name: 'Malaysia', flag: '🇲🇾' },
  sg: { name: 'Singapore', flag: '🇸🇬' },
  za: { name: 'South Africa', flag: '🇿🇦' },
  eg: { name: 'Egypt', flag: '🇪🇬' },
  ng: { name: 'Nigeria', flag: '🇳🇬' },
  ke: { name: 'Kenya', flag: '🇰🇪' },
  ph: { name: 'Philippines', flag: '🇵🇭' },
  th: { name: 'Thailand', flag: '🇹🇭' },
  vn: { name: 'Vietnam', flag: '🇻🇳' },
  se: { name: 'Sweden', flag: '🇸🇪' },
  no: { name: 'Norway', flag: '🇳🇴' },
  pl: { name: 'Poland', flag: '🇵🇱' },
  pt: { name: 'Portugal', flag: '🇵🇹' },
  ch: { name: 'Switzerland', flag: '🇨🇭' },
  at: { name: 'Austria', flag: '🇦🇹' },
  be: { name: 'Belgium', flag: '🇧🇪' },
  dk: { name: 'Denmark', flag: '🇩🇰' },
  fi: { name: 'Finland', flag: '🇫🇮' },
  ie: { name: 'Ireland', flag: '🇮🇪' },
  nz: { name: 'New Zealand', flag: '🇳🇿' },
  cn: { name: 'China', flag: '🇨🇳' },
  tw: { name: 'Taiwan', flag: '🇹🇼' },
  hk: { name: 'Hong Kong', flag: '🇭🇰' },
  qa: { name: 'Qatar', flag: '🇶🇦' },
  kw: { name: 'Kuwait', flag: '🇰🇼' },
  ma: { name: 'Morocco', flag: '🇲🇦' },
  dz: { name: 'Algeria', flag: '🇩🇿' },
  ge: { name: 'Georgia', flag: '🇬🇪' },
  py: { name: 'Paraguay', flag: '🇵🇾' },
  gr: { name: 'Greece', flag: '🇬🇷' },
  ro: { name: 'Romania', flag: '🇷🇴' },
  co: { name: 'Colombia', flag: '🇨🇴' },
  cl: { name: 'Chile', flag: '🇨🇱' },
  pe: { name: 'Peru', flag: '🇵🇪' },
  af: { name: 'Afghanistan', flag: '🇦🇫' },
  np: { name: 'Nepal', flag: '🇳🇵' },
  lk: { name: 'Sri Lanka', flag: '🇱🇰' },
  int: { name: 'International', flag: '🌐' }
};

export function getCountryInfo(code) {
  if (!code) return { code: 'unknown', name: 'Global', flag: '🌐' };
  const lower = code.toLowerCase().trim();
  if (COUNTRY_MAP[lower]) {
    return { code: lower, ...COUNTRY_MAP[lower] };
  }
  return {
    code: lower,
    name: lower.toUpperCase(),
    flag: '🌐'
  };
}
