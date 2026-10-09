// Wraps content in four autofocus-style corner marks. Used as the visual signature.
export default function Bracket({ children, className = '', size = 18, color }) {
  const style = { '--af-size': `${size}px`, ...(color ? { '--af-color': color } : {}) }
  return (
    <div className={`relative ${className}`} style={style}>
      <span className="af-corner af-tl" />
      <span className="af-corner af-tr" />
      <span className="af-corner af-bl" />
      <span className="af-corner af-br" />
      {children}
    </div>
  )
}
