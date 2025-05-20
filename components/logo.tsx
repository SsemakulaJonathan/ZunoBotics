// components/logo.tsx
import type { SVGProps } from "react"

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="48" height="48" rx="8" fill="hsl(var(--primary))" />
      <path
        d="M18 14C18 12.8954 18.8954 12 20 12H28C29.1046 12 30 12.8954 30 14V20C30 21.1046 29.1046 22 28 22H20C18.8954 22 18 21.1046 18 20V14Z"
        fill="hsl(var(--primary-foreground))"
      />
      <rect x="22" y="26" width="4" height="10" rx="2" fill="hsl(var(--primary-foreground))" />
      <rect x="14" y="30" width="4" height="6" rx="2" fill="hsl(var(--primary-foreground))" />
      <rect x="30" y="30" width="4" height="6" rx="2" fill="hsl(var(--primary-foreground))" />
      <circle cx="16" cy="16" r="2" fill="hsl(var(--primary))" />
      <circle cx="32" cy="16" r="2" fill="hsl(var(--primary))" />
      <rect x="22" y="18" width="4" height="1" rx="0.5" fill="hsl(var(--primary))" />
    </svg>
  )
}