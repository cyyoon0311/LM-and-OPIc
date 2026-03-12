export function LearnIcon({ active }: { active: boolean }) {
  const color = active ? '#171717' : '#a3a3a3'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="2" width="11" height="17" rx="2" fill={color} opacity="0.4" />
      <rect x="8" y="2" width="11" height="17" rx="2" fill={color} />
      <rect x="11" y="7" width="5" height="1.5" rx="0.75" fill="white" />
      <rect x="11" y="11" width="5" height="1.5" rx="0.75" fill="white" />
    </svg>
  )
}
