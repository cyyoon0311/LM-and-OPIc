export function RecordIcon({ active }: { active: boolean }) {
  const color = active ? '#171717' : '#a3a3a3'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="11" rx="3" fill={color} />
      <path
        d="M5 11C5 14.866 8.134 18 12 18C15.866 18 19 14.866 19 11"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="22" x2="14" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
