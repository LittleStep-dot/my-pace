import FootprintIcon from './FootprintIcon'
const collectionArt = {
  'first-step': 'collection-001-first-step.png',
  'statue-liberty': 'collection-002-statue-of-liberty.png',
  hyperion: 'collection-003-hyperion.png',
  seongsan: 'collection-004-seongsan-ilchulbong.png',
  'building-63': 'collection-005-63-building.png',
  titanic: 'collection-006-titanic.png',
  eiffel: 'collection-007-eiffel-tower.png',
  track: 'collection-008-track-lap.png',
  lotte: 'collection-009-lotte-world-tower.png',
  'tokyo-skytree': 'collection-010-tokyo-skytree.png',
}

export default function MilestoneIcon({ milestone }) {
  const asset = collectionArt[milestone.id]
  if (asset) return <img className="collection-art" src={`${import.meta.env.BASE_URL}art/collections/${asset}`} alt="" />
  return milestone.id === 'first-step' ? <FootprintIcon /> : milestone.icon
}
