// IMPORTANT: Import ONLY from lightweight file to avoid bundling 19MB index.js
// The lightweight.js file contains only manifest, monthlySummary, and sampleGames (~136KB)
// The heavy gameMeta (27,200 games, ~177MB) is in index.js and loaded dynamically only when needed
import { manifest, monthlySummary, sampleGames } from '../generated/lightweight.js'

// Lightweight exports (always safe to import)
export const getManifest = () => manifest
export const getMonthlySummary = () => monthlySummary
export const getSampleGames = () => sampleGames

// Cache for loaded gameMeta to avoid re-importing
let gameMetaCache = null

// Heavy exports - DEPRECATED (use async versions instead)
// These load ALL 27,200 games into memory - avoid in new code!
// IMPORTANT: This function is intentionally broken to prevent accidental use
// If you need game data, use loadMonthGames() instead
export const getGameMeta = () => {
  throw new Error('[chess-data] getGameMeta() is deprecated and disabled. Use loadMonthGames(month) for progressive loading instead.')
}

// Async month-based loading (RECOMMENDED)
export const loadMonthGames = async (month) => {
  try {
    // Load gameMeta only once and cache it
    if (!gameMetaCache) {
      const module = await import(/* webpackChunkName: "chess-gamemeta" */ '../generated/index.js')
      gameMetaCache = module.gameMeta
    }
    // Filter for the requested month
    return gameMetaCache.filter((game) => game.month === month)
  } catch (err) {
    console.warn(`[chess-data] Failed to load games for month: ${month}`, err)
    return []
  }
}

// Get random month from available months
export const getRandomMonth = () => {
  const months = monthlySummary.map(entry => entry.month).filter(Boolean)
  return months[Math.floor(Math.random() * months.length)]
}

// Find games by month (legacy - sync version) - DEPRECATED
export const findGamesByMonth = (month) => {
  console.warn('[chess-data] findGamesByMonth() is deprecated. Use loadMonthGames() instead.')
  const gameMeta = getGameMeta()
  return gameMeta.filter((game) => game.month === month)
}

// Find game by ID (legacy - sync version) - DEPRECATED
export const findGameById = (id) => {
  console.warn('[chess-data] findGameById() is deprecated. Use async version instead.')
  const gameMeta = getGameMeta()
  return gameMeta.find((game) => game.id === id)
}

// Async version - find game by ID
export const findGameByIdAsync = async (id) => {
  // Check sampleGames first (lightweight, already loaded)
  const sampleMatch = sampleGames.find((game) => game.id === id)
  if (sampleMatch) return sampleMatch

  // Load full gameMeta
  if (!gameMetaCache) {
    const module = await import(/* webpackChunkName: "chess-gamemeta" */ '../generated/index.js')
    gameMetaCache = module.gameMeta
  }
  return gameMetaCache.find((game) => game.id === id)
}

// Get month for a game ID - async version (RECOMMENDED)
export const getGameMonthByIdAsync = async (id) => {
  const game = await findGameByIdAsync(id)
  return game?.month ?? null
}

// DEPRECATED: Synchronous version - only works if gameMeta already loaded
export const getGameMonthById = (id) => {
  // Try sampleGames first
  const sampleMatch = sampleGames.find((game) => game.id === id)
  if (sampleMatch) return sampleMatch.month ?? null

  // If not in samples, we can't get it without loading all data
  console.warn('[chess-data] getGameMonthById() cannot find game without loading all data. Use getGameMonthByIdAsync() instead.')
  return null
}

// DEPRECATED: Synchronous version - use getGamePgnByIdAsync instead
export const getGamePgnById = (id) => {
  console.warn('[chess-data] getGamePgnById() is deprecated. Use getGamePgnByIdAsync() instead.')
  const sampleMatch = sampleGames.find((game) => game.id === id && Boolean(game?.pgn))
  if (sampleMatch) return sampleMatch.pgn
  // Can't get PGN without async loading
  return null
}

// Load PGN data for a specific month dynamically
export const loadMonthlyPgn = async (month) => {
  try {
    const data = await import(`../generated/pgn/by-month/${month}.json`)
    return data.default || data
  } catch (err) {
    console.warn(`[chess-data] Failed to load PGN data for month: ${month}`, err)
    return null
  }
}

// Get PGN for a game by loading the monthly file (RECOMMENDED)
export const getGamePgnByIdAsync = async (id) => {
  // First check sampleGames (fast, synchronous)
  const sampleMatch = sampleGames.find((game) => game.id === id && Boolean(game?.pgn))
  if (sampleMatch) return sampleMatch.pgn

  // Get the month for this game (async to avoid loading all gameMeta)
  const month = await getGameMonthByIdAsync(id)
  if (!month) return null

  // Load the monthly PGN file
  const monthlyData = await loadMonthlyPgn(month)
  if (!monthlyData) return null

  // Return the PGN for this specific game
  return monthlyData[id] ?? null
}
