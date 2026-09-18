import FootprintIcon from './FootprintIcon'
export default function MilestoneIcon({ milestone }) { return milestone.id === 'first-step' ? <FootprintIcon /> : milestone.icon }
