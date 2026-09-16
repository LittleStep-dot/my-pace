const ART={
  idle:'char_idle.webp',
  cheer:'char_cheer.webp',
  reward:'char_reward.webp',
  happy:'char_reward.webp',
  walk:'char_journey.webp',
  sleep:'char_sleep.webp',
  think:'char_idle.webp',
}

export default function Mascot({mood='idle',size='md',back=false}){
  const file=back?'char_journey.webp':(ART[mood]||ART.idle)
  return <div className={`mascot mascot-${size} mood-${mood} ${back?'back':''}`} aria-hidden="true">
    <img className="mascot-img" src={`${import.meta.env.BASE_URL}art/${file}`} alt="" />
  </div>
}
