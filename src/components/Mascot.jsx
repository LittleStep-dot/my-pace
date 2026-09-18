import { TODAY_MASCOT_STATES } from '../lib/todayMascot'

export default function Mascot({
  mood = 'idle',
  size = 'md',
  className = '',
  back = false,
}) {
  mood = back || mood === 'walk' ? 'journey' : mood
  const srcMap = {
    onboarding: '/art/char-onboarding.png',
    'today-rest': '/art/char-today-rest.png',
    'today-1': '/art/char-today-1.png',
    'today-2': '/art/char-today-2.png',
    'today-success': '/art/char-today-success.png',
    journey: '/art/char-journey.png',
    profile: '/art/char-profile.png',
    sleep: '/art/char-sleep.png',
    special: '/art/char-special.png',
    'today-thinking': `/art/${TODAY_MASCOT_STATES.thinking.asset}`,
    'today-start': `/art/${TODAY_MASCOT_STATES.start.asset}`,
    'today-cheer': `/art/${TODAY_MASCOT_STATES.cheer.asset}`,
    'today-star': `/art/${TODAY_MASCOT_STATES.star.asset}`,
    'today-heart': `/art/${TODAY_MASCOT_STATES.heart.asset}`,
  }

  const sizeClass =
    size === 'sm' ? 'mascot-sm' :
    size === 'lg' ? 'mascot-lg' :
    'mascot-md'

  return (
    <div className={`mascot mascot-${mood} ${sizeClass} ${className}`}>
      <img draggable="false" src={`${import.meta.env.BASE_URL}${(srcMap[mood] || srcMap.onboarding).slice(1)}`} alt="" />
      {mood === 'sleep' && (
        <span className="sleep-zzz" aria-hidden="true"><i>z</i><b>Z</b><strong>Z</strong></span>
      )}
    </div>
  )
}
