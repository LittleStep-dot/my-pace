const MILESTONES = [
  {
    id: 'first-20m',
    meters: 20,
    name: '첫 20m',
    icon: '👣',
    region: 'My Pace',
    category: 'special',
    discovery: '첫 번째 작은 목표가 여정의 시작이 되었어요.',
    description: '20m는 일반적인 성인의 걸음으로 약 30걸음 정도예요.',
    fact: '아주 긴 여정도 처음에는 작은 한 걸음에서 시작돼요.',
  },
  {
    id: 'statue-of-liberty', meters: 100, name: '자유의 여신상', icon: '🗽', region: '미국 · 뉴욕', category: 'world',
    discovery: '자유의 여신상을 세로로 지나온 것보다 멀리 왔어요.',
    description: '받침대 바닥부터 횃불 끝까지 약 93m인 세계적인 랜드마크예요.',
    fact: '1886년 프랑스가 미국에 선물한 자유의 상징이에요.',
  },
  {
    id: 'namsan', meters: 260, name: '남산', icon: '⛰️', region: '대한민국 · 서울', category: 'korea',
    discovery: '서울 남산의 높이에 가까운 거리를 쌓았어요.',
    description: '작은 목표 13개가 모이면 약 260m의 여정이 돼요.',
    fact: '남산은 서울 도심에서 사계절 풍경을 만날 수 있는 산이에요.',
  },
  {
    id: 'track-lap', meters: 400, name: '트랙 한 바퀴', icon: '🏟️', region: '운동장', category: 'special',
    discovery: '표준 육상 트랙 한 바퀴만큼 전진했어요.',
    description: '20개의 작은 목표가 모여 400m를 만들었어요.',
    fact: '표준 실외 육상 트랙의 안쪽 한 바퀴는 400m예요.',
  },
  {
    id: 'lotte-world-tower', meters: 560, name: '롯데월드타워', icon: '🏙️', region: '대한민국 · 서울', category: 'korea',
    discovery: '롯데월드타워 높이보다 멀리 왔어요.',
    description: '높이 555m의 롯데월드타워를 넘어서는 거리예요.',
    fact: '롯데월드타워는 123층 규모의 초고층 건축물이에요.',
  },
  {
    id: 'tokyo-skytree', meters: 640, name: '도쿄 스카이트리', icon: '🗼', region: '일본 · 도쿄', category: 'world',
    discovery: '도쿄 스카이트리 높이보다 멀리 왔어요.',
    description: '높이 634m의 방송 타워를 넘어선 여정이에요.',
    fact: '634는 옛 지명 무사시와 연결되는 숫자로도 알려져 있어요.',
  },
  {
    id: 'burj-khalifa', meters: 840, name: '부르즈 할리파', icon: '🌆', region: '아랍에미리트 · 두바이', category: 'world',
    discovery: '세계적인 초고층 빌딩의 높이를 넘어섰어요.',
    description: '높이 828m의 부르즈 할리파보다 멀리 온 순간이에요.',
    fact: '사막 도시 두바이의 스카이라인을 대표하는 건축물이에요.',
  },
  {
    id: 'first-1k', meters: 1000, name: '첫 1km', icon: '🏅', region: 'My Pace', category: 'special',
    discovery: '50개의 작은 목표가 첫 1km를 만들었어요.',
    description: '거창한 하루가 아니라 작은 하루들이 쌓인 거리예요.',
    fact: '20m를 50번 이어 붙이면 정확히 1km가 돼요.',
  },
  {
    id: 'haeundae', meters: 1500, name: '해운대 백사장', icon: '🌊', region: '대한민국 · 부산', category: 'korea',
    discovery: '해운대 백사장 길이에 가까운 거리를 걸어왔어요.',
    description: '부산을 대표하는 해변의 긴 풍경을 떠올려보세요.',
    fact: '해운대는 부산의 바다와 도시 풍경을 함께 만나는 곳이에요.',
  },
  {
    id: 'jirisan-cheonwangbong', meters: 1920, name: '지리산 천왕봉', icon: '⛰️', region: '대한민국 · 지리산', category: 'korea',
    discovery: '지리산 천왕봉 높이보다 멀리 왔어요.',
    description: '해발 1,915m인 지리산 최고봉에 닿는 거리예요.',
    fact: '천왕봉은 지리산의 수많은 능선과 봉우리를 내려다봐요.',
  },
  {
    id: 'seokchon-lake', meters: 2500, name: '석촌호수 한 바퀴', icon: '🌸', region: '대한민국 · 서울', category: 'korea',
    discovery: '호숫가를 한 바퀴 산책할 만한 거리가 쌓였어요.',
    description: '약 2.5km의 여정을 작은 목표들이 함께 만들었어요.',
    fact: '석촌호수는 동호와 서호 두 개의 호수로 나뉘어 있어요.',
  },
  {
    id: 'golden-gate-bridge', meters: 2740, name: '금문교', icon: '🌉', region: '미국 · 샌프란시스코', category: 'world',
    discovery: '금문교 전체 길이에 가까운 거리를 왔어요.',
    description: '약 2.7km 규모의 다리를 건널 만큼 여정이 이어졌어요.',
    fact: '특유의 붉은빛 색상은 안개 속에서도 잘 보이도록 선택됐어요.',
  },
  {
    id: 'suwon-hwaseong', meters: 5400, name: '수원화성 성곽길', icon: '🏯', region: '대한민국 · 경기', category: 'korea',
    discovery: '수원화성 성곽을 따라 한 바퀴 걸을 만한 거리예요.',
    description: '약 5.4km의 성곽길만큼 작은 실천이 이어졌어요.',
    fact: '수원화성은 전통 축성 기술과 새로운 기술이 함께 쓰였어요.',
  },
  {
    id: 'cheonggyecheon', meters: 10840, name: '청계천', icon: '💧', region: '대한민국 · 서울', category: 'korea',
    discovery: '청계천 전체 길이만큼 여정을 이어왔어요.',
    description: '도심을 흐르는 약 10.84km의 물길에 닿았어요.',
    fact: '청계천은 서울 도심을 가로지르며 한강 수계로 이어져요.',
  },
  {
    id: 'half-marathon', meters: 21100, name: '하프마라톤', icon: '🥈', region: 'My Pace', category: 'special',
    discovery: '작은 목표들이 하프마라톤 한 번의 거리를 만들었어요.',
    description: '꾸준함이 만든 21.1km의 특별한 발자취예요.',
    fact: '공식 하프마라톤 거리는 21.0975km예요.',
  },
  {
    id: 'marathon', meters: 42200, name: '마라톤', icon: '🏆', region: 'My Pace', category: 'special',
    discovery: '마라톤 한 번을 완주할 만큼의 여정이에요.',
    description: '수많은 작은 행동이 42.195km를 넘어섰어요.',
    fact: '지금의 마라톤 공식 거리는 42.195km예요.',
  },
]

export const JOURNEY_MILESTONES = MILESTONES.map((milestone) => ({
  ...milestone,
  type: milestone.category === 'special' ? 'achievement' : 'landmark',
}))

export const passedMilestones = (meters) => JOURNEY_MILESTONES.filter((item) => meters >= item.meters)
export const nextMilestone = (meters) => JOURNEY_MILESTONES.find((item) => meters < item.meters) || null

export function journeyScene(meters) {
  if (meters >= 42200) return 'world'
  if (meters >= 10840) return 'coast'
  if (meters >= 5400) return 'mountain'
  if (meters >= 1920) return 'nature'
  if (meters >= 560) return 'city'
  return 'neighborhood'
}
