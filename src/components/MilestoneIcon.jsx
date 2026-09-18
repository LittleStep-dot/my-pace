import FootprintIcon from './FootprintIcon'

export default function MilestoneIcon({ milestone, className = '' }) {
  return milestone.id === 'first-step' ? <FootprintIcon className={className} /> : milestone.icon
}
