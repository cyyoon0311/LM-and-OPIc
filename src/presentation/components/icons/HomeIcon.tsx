export function HomeIcon({ active }: { active: boolean }) {
  const color = active ? '#171717' : '#a3a3a3'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
        fill={color}
      />
    </svg>
  )
}
