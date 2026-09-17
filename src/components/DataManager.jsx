export default function DataManager({ onBack, onGoals, onOnboarding, onResetAll }) {
  return (
    <section className="profile-panel data-panel">
      <header className="panel-head">
        <button type="button" onClick={onBack} aria-label="뒤로가기">‹</button>
        <div><h1>데이터 관리</h1><p>기록은 보존하고, 필요한 설정만 다시 다듬을 수 있어요.</p></div>
      </header>
      <div className="data-card">
        <button type="button" onClick={onGoals}><i>🎯</i><span><b>목표 다시 설정하기</b><small>현재 Daily Goal만 다시 골라요. 과거 기록은 유지돼요.</small></span><em>›</em></button>
        <button type="button" onClick={onOnboarding}><i>🌱</i><span><b>온보딩 다시 보기</b><small>이름과 관심 분야, 목표 선택을 다시 진행해요.</small></span><em>›</em></button>
        <button type="button" className="danger" onClick={onResetAll}><i>🗑️</i><span><b>모든 데이터 초기화</b><small>프로필, 여정, 목표, 완료 기록을 모두 삭제해요.</small></span><em>›</em></button>
      </div>
    </section>
  )
}
