export const PBS_TYPES = {
  ASSET: 'asset',
  EPISODE: 'episode',
  SPECIAL: 'special',
  COLLECTION: 'collection',
  SEASON: 'season',
  SHOW: 'show',
  REMOTE_ASSET: 'remote-asset',
  FRANCHISE: 'franchise',
  STATION: 'station',
  CHANGELOG: 'changelog'
}

export const PBS_CHILD_TYPES = {
  ASSET: PBS_TYPES.ASSET,
  EPISODE: PBS_TYPES.EPISODE,
  SPECIAL: PBS_TYPES.SPECIAL,
  COLLECTION: PBS_TYPES.COLLECTION,
  SEASON: PBS_TYPES.SEASON,
}

export const PBS_PARENT_TYPES = {
  FRANCHISE: PBS_TYPES.FRANCHISE,
  SHOW: PBS_TYPES.SHOW,
  SEASON: PBS_TYPES.SEASON,
  COLLECTION: PBS_TYPES.COLLECTION,
  SPECIAL: PBS_TYPES.SPECIAL,
  EPISODE: PBS_TYPES.EPISODE,
}

export const PBS_ASSET_TYPES = {
  PREVIEW: 'preview',
  CLIP: 'clip',
  EXTRA: 'extra',
  FULL_LENGTH: 'full_length',
  ALL: 'all',
}


export const PBS_WINDOW_TYPES = {
  PUBLIC: 'public',
  ALL_MEMBERS: 'all_members',
  STATION_MEMBERS: 'station_members',
  UNAVAILABLE: 'unavailable',
  ALL: 'all',
}

export type PBSType = (typeof PBS_TYPES)[keyof typeof PBS_TYPES];
export type PBSChildType = (typeof PBS_CHILD_TYPES)[keyof typeof PBS_CHILD_TYPES];
export type PBSParentType = (typeof PBS_PARENT_TYPES)[keyof typeof PBS_PARENT_TYPES];
export type PBSAssetType = (typeof PBS_ASSET_TYPES)[keyof typeof PBS_ASSET_TYPES];
export type PBSWindowType = (typeof PBS_WINDOW_TYPES)[keyof typeof PBS_WINDOW_TYPES];