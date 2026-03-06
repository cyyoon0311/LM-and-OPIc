export function ScriptIcon({ active }: { active: boolean }) {
  const color = active ? '#171717' : '#a3a3a3'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="2" fill={color} />
      <rect x="7" y="7" width="10" height="1.5" rx="0.75" fill="white" />
      <rect x="7" y="11" width="10" height="1.5" rx="0.75" fill="white" />
      <rect x="7" y="15" width="6" height="1.5" rx="0.75" fill="white" />
    </svg>
  )
}
