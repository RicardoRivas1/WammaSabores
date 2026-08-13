import { useMemo } from 'react'

export default function EmberField({ count = 10 }) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        size: 3 + Math.random() * 5,
        left: Math.random() * 100,
        drift: Math.random() * 40 - 20,
        duration: 4 + Math.random() * 5,
        delay: Math.random() * 6,
      })),
    [count],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {embers.map((e) => (
        <span
          key={e.id}
          className="absolute -bottom-2 rounded-full opacity-90 animate-rise"
          style={{
            width: e.size,
            height: e.size,
            left: `${e.left}%`,
            background:
              'radial-gradient(circle, #FF7A29 0%, rgba(230,81,0,0) 70%)',
            '--drift': `${e.drift}px`,
            animationDuration: `${e.duration}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
