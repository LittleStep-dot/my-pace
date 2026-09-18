export const AVATAR_OPTIONS = Array.from({ length: 8 }, (_, index) => {
  const id = `avatar-${String(index + 1).padStart(2, '0')}`
  return { id, label: `기본 아바타 ${index + 1}` }
})

const knownAvatarIds = new Set(AVATAR_OPTIONS.map((avatar) => avatar.id))

export function isAvatarSelection(avatar) {
  return avatar?.type === 'avatar' && knownAvatarIds.has(avatar.id)
}

export function profileAvatarSrc(avatar, baseUrl = import.meta.env.BASE_URL) {
  if (avatar?.type === 'photo' && avatar.value) return avatar.value
  if (isAvatarSelection(avatar)) return `${baseUrl}art/${avatar.id}.png`
  return `${baseUrl}art/avatar-profile.png`
}
