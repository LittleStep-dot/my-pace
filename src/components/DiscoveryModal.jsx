import { distance } from '../lib/product'
import MilestoneIcon from './MilestoneIcon'

export default function DiscoveryModal({ discovery, onClose, onOpenJourney }) {
  if (!discovery) return null
  return <div className="discovery-overlay" role="dialog" aria-modal="true" aria-label="새로운 발자취 발견"><article className="discovery-sheet">
    <small>NEW DISCOVERY</small><span className="discovery-icon"><MilestoneIcon milestone={discovery} className="milestone-icon-xl" /></span><p>{discovery.region}</p><h2>{discovery.name}</h2><strong>{distance(discovery.meters)}</strong>
    <div className="discovery-copy"><b>{discovery.discovery}</b><p>{discovery.description}</p></div><aside><b>💡 잠깐 상식</b><p>{discovery.fact}</p></aside>
    <button onClick={() => { onClose(); onOpenJourney() }}>나의 발자취 보기</button>
  </article></div>
}
