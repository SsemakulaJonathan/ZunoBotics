// components/logo.tsx
import Image from "next/image"
import type { HTMLAttributes } from "react"

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  width?: number
  height?: number
}

export default function Logo({ width = 40, height = 40, className, ...props }: LogoProps) {
  return (
    <div className={className} {...props}>
      <Image
        src="/zunobotics-logo.png"
        alt="ZunoBotics Logo"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  )
}