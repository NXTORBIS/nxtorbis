/**
 * Re-mounts on every route change, giving each page a short, calm entrance.
 * Motion is CSS-only and disabled under prefers-reduced-motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
