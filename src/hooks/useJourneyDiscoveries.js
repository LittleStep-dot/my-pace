import { useEffect, useRef, useState } from 'react'
import { passedMilestones } from '../data/milestones'

const STORAGE_KEY = 'myPaceV4Discoveries'

function readDiscoveries() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

export default function useJourneyDiscoveries(totalMeters) {
  const [discoveredIds, setDiscoveredIds] = useState(readDiscoveries)
  const [discovery, setDiscovery] = useState(null)
  const initialized = useRef(false)
  const previousMeters = useRef(totalMeters)

  useEffect(() => {
    const passed = passedMilestones(totalMeters)
    const known = new Set(discoveredIds)
    const newlyPassed = passed.filter((item) => !known.has(item.id))

    if (newlyPassed.length) {
      const nextIds = [...new Set([...discoveredIds, ...newlyPassed.map((item) => item.id)])]
      setDiscoveredIds(nextIds)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds))

      if (initialized.current && totalMeters > previousMeters.current) {
        setDiscovery(newlyPassed.at(-1))
      }
    }

    initialized.current = true
    previousMeters.current = totalMeters
  }, [totalMeters])

  const clearDiscoveries = () => { setDiscoveredIds([]); setDiscovery(null); previousMeters.current = 0 }
  return { discoveredIds, discovery, dismissDiscovery: () => setDiscovery(null), clearDiscoveries }
}
