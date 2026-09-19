import { useEffect, useRef, useState } from 'react'
import { passedMilestones } from '../data/milestonesV2'

const STORAGE_KEY = 'myPaceV4Discoveries'

function readDiscoveries() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(value)) return []
    return value.map((entry) => typeof entry === 'string'
      ? { id: entry, discoveredAt: null, totalMeters: null }
      : entry).filter((entry) => entry?.id)
  } catch { return [] }
}

export default function useJourneyDiscoveries(totalMeters) {
  const [discoveryRecords, setDiscoveryRecords] = useState(readDiscoveries)
  const [discovery, setDiscovery] = useState(null)
  const initialized = useRef(false)
  const previousMeters = useRef(totalMeters)
  const discoveredIds = discoveryRecords.map((record) => record.id)

  useEffect(() => {
    const passed = passedMilestones(totalMeters)
    const known = new Set(discoveredIds)
    const newlyPassed = passed.filter((item) => !known.has(item.id))
    if (newlyPassed.length) {
      const isNewSession = initialized.current && totalMeters > previousMeters.current
      const records = newlyPassed.map((item) => ({ id: item.id, discoveredAt: isNewSession ? new Date().toISOString() : null, totalMeters: isNewSession ? totalMeters : null }))
      const next = [...discoveryRecords, ...records]
      setDiscoveryRecords(next)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      if (isNewSession) setDiscovery({ ...newlyPassed.at(-1), discoveryRecord: records.at(-1) })
    }
    initialized.current = true
    previousMeters.current = totalMeters
  }, [totalMeters])

  const clearDiscoveries = () => { setDiscoveryRecords([]); setDiscovery(null); previousMeters.current = 0 }
  return { discoveredIds, discoveryRecords, discovery, dismissDiscovery: () => setDiscovery(null), clearDiscoveries }
}
