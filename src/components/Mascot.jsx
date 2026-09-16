export default function Mascot({
  mood = 'idle',
  size = 'md',
  className = '',
  back = false,
}) {
  mood = back || mood === 'walk' ? 'journey' : mood === 'happy' ? 'cheer' : mood
  const srcMap = {
    idle: '/art/char-idle.png',
    cheer: '/art/char-cheer.png',
    reward: '/art/char-reward.png',
    journey: '/art/char-journey.png',
    sleep: '/art/char-sleep.png',
    think: '/art/char-think.png',
  }

  const sizeClass =
    size === 'sm' ? 'mascot-sm' :
    size === 'lg' ? 'mascot-lg' :
    'mascot-md'

  return (
    <div className={`mascot mascot-${mood} ${sizeClass} ${className}`}>
      <img draggable="false" src={`${import.meta.env.BASE_URL}${(srcMap[mood] || srcMap.idle).slice(1)}`} alt="" />
      {mood === 'sleep' && (
        <div className="mascot-zzz" aria-hidden="true">
          <span>z</span>
          <span>Z</span>
          <span>Z</span>
        </div>
      )}
      {mood === 'think' && (
        <div className="mascot-question" aria-hidden="true">?</div>
      )}
      {(mood === 'reward' || mood === 'cheer') && (
        <div className="mascot-sparkle" aria-hidden="true">✨</div>
      )}
    </div>
  )
}
