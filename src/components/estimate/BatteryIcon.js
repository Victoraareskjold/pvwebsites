/**
 * Ikonene i batteriseksjonen, med samme strektegninger som prototypen
 * (Soleklart, 28. september 2026) slik at energidiagrammet ser likt ut.
 */

const PATHS = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  battery: (
    <>
      <rect x="3" y="6" width="17" height="12" rx="2" />
      <path d="M23 10v4M7 10v4m4-4v4m4-4v4" />
    </>
  ),
  inverter: (
    <>
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <path d="M9 7h6m-7 8c2-6 6 6 8 0" />
    </>
  ),
  home: <path d="m3 11 9-8 9 8M5 10v10h14V10M10 20v-7h4v7" />,
  grid: <path d="m12 2-6 20m6-20 6 20M8 7h8M6 12h12M4 17h16M4 7h16M3 12h18" />,
  check: <path d="m5 12 4 4L19 6" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  shield: (
    <>
      <path d="m12 3-8 3v6c0 5 8 9 8 9s8-4 8-9V6Z" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6m0-10v.1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
};

export default function BatteryIcon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name] ?? PATHS.info}
    </svg>
  );
}
