import { createReadStream, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse'

const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..')
const rootDir = join(__dirname, '..')
const sourcesDir = join(rootDir, 'sources')
const generatedDir = join(rootDir, 'generated')
const pgnByMonthDir = join(generatedDir, 'pgn', 'by-month')

const USERNAME = 'biskupstunga'

const parsePythonDictString = (value) => {
  if (!value || typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed === 'None') {
    return null
  }

  const normalised = trimmed
    .replace(/'/g, '"')
    .replace(/\bNone\b/g, 'null')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')

  try {
    return JSON.parse(normalised)
  } catch (error) {
    console.warn('Failed to parse python dict string', { value })
    return null
  }
}

const classifyResult = (result) => {
  if (!result) return 'unknown'
  const value = String(result).toLowerCase()

  if (value === 'win' || value === 'won') return 'win'
  if (value === 'agreed' || value === 'stalemate' || value === 'repetition') return 'draw'
  if (value.includes('insufficient')) return 'draw'

  if (
    value === 'resigned' ||
    value === 'timeout' ||
    value === 'abandoned' ||
    value === 'checkmated' ||
    value === 'lose'
  ) {
    return 'loss'
  }

  return 'unknown'
}

const extractTermination = (pgn) => {
  if (!pgn) return null
  const match = pgn.match(/\[Termination\s+"([^"]+)"\]/)
  return match ? match[1] : null
}

const determineTerminationCategory = (playerResult, terminationText) => {
  if (!terminationText) return null
  const lower = terminationText.toLowerCase()
  if (lower.includes('resignation')) {
    return `${playerResult}-resignation`
  }
  if (lower.includes('checkmate')) {
    return `${playerResult}-checkmate`
  }
  if (lower.includes('time')) {
    return `${playerResult}-time`
  }
  if (lower.includes('stalemate')) {
    return 'draw-stalemate'
  }
  if (lower.includes('agreed')) {
    return 'draw-agreed'
  }
  if (lower.includes('repetition')) {
    return 'draw-repetition'
  }
  if (lower.includes('insufficient')) {
    return 'draw-insufficient'
  }
  if (lower.includes('abandon')) {
    return `${playerResult}-abandoned`
  }
  return `${playerResult}-other`
}

const formatMonthKey = (timestamp) => {
  if (!timestamp) return 'unknown'
  const date = new Date(timestamp * 1000)
  if (Number.isNaN(date.getTime())) return 'unknown'
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const incrementMapValue = (map, key, amount = 1) => {
  map.set(key, (map.get(key) ?? 0) + amount)
}

const parseCsvFile = (filePath) =>
  new Promise((resolve, reject) => {
    const records = []

    const parser = parse({
      columns: true,
      skip_empty_lines: false,
      trim: false,
      relax_quotes: true,
      relax_column_count: true
    })

    parser.on('readable', () => {
      let record
      while ((record = parser.read()) !== null) {
        records.push(record)
      }
    })

    parser.on('error', reject)
    parser.on('end', () => resolve(records))

    createReadStream(filePath).pipe(parser)
  })

const main = async () => {
  mkdirSync(generatedDir, { recursive: true })

  const csvFiles = readdirSync(sourcesDir)
    .filter((file) => file.endsWith('.csv'))
    .map((file) => join(sourcesDir, file))

  if (!csvFiles.length) {
    console.warn('No CSV files found in sources directory.')
    return
  }

  const records = []

  for (const file of csvFiles) {
    const parsed = await parseCsvFile(file)
    records.push(...parsed)
  }

  const opponentCounts = new Map()
  const ecoCounts = new Map()
  const terminationCounts = new Map()
  const timeClassCounts = new Map()
  const timeControlCounts = new Map()

  const monthlyMap = new Map()
  const pgnByMonth = new Map()

  let firstEndTime = null
  let lastEndTime = null
  let ratedGames = 0
  let unratedGames = 0

  const gameMeta = []
  const sampleGames = []

  for (const record of records) {
    const white = parsePythonDictString(record.white)
    const black = parsePythonDictString(record.black)
    const isWhitePlayer =
      white?.username?.toLowerCase() === USERNAME ||
      white?.username?.toLowerCase() === USERNAME.toLowerCase()
    const isBlackPlayer =
      black?.username?.toLowerCase() === USERNAME ||
      black?.username?.toLowerCase() === USERNAME.toLowerCase()

    if (!isWhitePlayer && !isBlackPlayer) {
      continue
    }

    const player = isWhitePlayer ? white : black
    const opponent = isWhitePlayer ? black : white

    const endTime = Number(record.end_time) || Number(record.EndTime) || null
    const startTime = Number(record.start_time) || Number(record.StartTime) || null
    const rated = String(record.rated).toLowerCase() === 'true'
    const timeClass = record.time_class || 'unknown'
    const timeControl = record.time_control || 'unknown'
    const eco = record.eco || null
    const termination = extractTermination(record.pgn)
    const playerResult = classifyResult(player?.result)

    if (rated) {
      ratedGames += 1
    } else {
      unratedGames += 1
    }

    incrementMapValue(timeClassCounts, timeClass)
    incrementMapValue(timeControlCounts, timeControl)

    if (opponent?.username) {
      incrementMapValue(opponentCounts, opponent.username)
    }

    if (eco) {
      incrementMapValue(ecoCounts, eco)
    }

    const terminationCategory = determineTerminationCategory(playerResult, termination)
    if (terminationCategory) {
      incrementMapValue(terminationCounts, terminationCategory)
    }

    if (endTime) {
      if (!firstEndTime || endTime < firstEndTime) firstEndTime = endTime
      if (!lastEndTime || endTime > lastEndTime) lastEndTime = endTime
    }

    const monthKey = formatMonthKey(endTime || startTime)
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, {
        month: monthKey,
        total: 0,
        results: { win: 0, draw: 0, loss: 0, unknown: 0 },
        rated: { rated: 0, unrated: 0 },
        timeClass: {},
        averagePlayerRating: 0,
        averageOpponentRating: 0,
        opponentSet: new Set(),
        ecoCounts: new Map()
      })
    }

    const monthly = monthlyMap.get(monthKey)
    monthly.total += 1
    monthly.results[playerResult] = (monthly.results[playerResult] ?? 0) + 1
    if (rated) {
      monthly.rated.rated += 1
    } else {
      monthly.rated.unrated += 1
    }
    monthly.timeClass[timeClass] = (monthly.timeClass[timeClass] ?? 0) + 1
    monthly.averagePlayerRating += Number(player?.rating) || 0
    monthly.averageOpponentRating += Number(opponent?.rating) || 0
    if (opponent?.username) {
      monthly.opponentSet.add(opponent.username)
    }
    if (eco) {
      monthly.ecoCounts.set(eco, (monthly.ecoCounts.get(eco) ?? 0) + 1)
    }

    const metaEntry = {
      id: record.uuid || record.url,
      url: record.url,
      startTime,
      endTime,
      month: monthKey,
      rated,
      timeClass,
      timeControl,
      eco,
      playerColor: isWhitePlayer ? 'white' : 'black',
      playerResult,
      player: {
        username: player?.username ?? USERNAME,
        rating: Number(player?.rating) || null,
        result: player?.result ?? null
      },
      opponent: {
        username: opponent?.username ?? null,
        rating: Number(opponent?.rating) || null,
        result: opponent?.result ?? null
      },
      termination,
      terminationCategory,
      sourceFile: record.sourceFile ?? null
    }

    gameMeta.push(metaEntry)

    if (sampleGames.length < 10) {
      sampleGames.push({
        ...metaEntry,
        pgn: record.pgn ?? null
      })
    }

    if (metaEntry.id && record.pgn && monthKey !== 'unknown') {
      if (!pgnByMonth.has(monthKey)) {
        pgnByMonth.set(monthKey, {})
      }
      pgnByMonth.get(monthKey)[metaEntry.id] = record.pgn
    }
  }

  const monthlySummary = Array.from(monthlyMap.values())
    .sort((a, b) => (a.month < b.month ? -1 : 1))
    .map((entry) => {
      const opponentCount = entry.opponentSet.size
      const ecoTop = Array.from(entry.ecoCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([ecoValue, count]) => ({ eco: ecoValue, count }))

      return {
        month: entry.month,
        total: entry.total,
        results: entry.results,
        rated: entry.rated,
        timeClass: entry.timeClass,
        averagePlayerRating:
          entry.total > 0 ? Math.round(entry.averagePlayerRating / entry.total) : null,
        averageOpponentRating:
          entry.total > 0 ? Math.round(entry.averageOpponentRating / entry.total) : null,
        uniqueOpponents: opponentCount,
        topEco: ecoTop
      }
    })

  const buildSorted = (map, limit = 10) =>
    Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key, count]) => ({ key, count }))

  const manifest = {
    totalGames: gameMeta.length,
    monthsTracked: monthlySummary.length,
    dateRange: {
      start: firstEndTime ? new Date(firstEndTime * 1000).toISOString() : null,
      end: lastEndTime ? new Date(lastEndTime * 1000).toISOString() : null
    },
    ratedGames,
    unratedGames,
    timeClassDistribution: buildSorted(timeClassCounts, timeClassCounts.size),
    timeControlDistribution: buildSorted(timeControlCounts, timeControlCounts.size),
    topOpponents: buildSorted(opponentCounts),
    topEcos: buildSorted(ecoCounts),
    terminationDistribution: buildSorted(terminationCounts, terminationCounts.size)
  }

  const fileContent = `export const manifest = ${JSON.stringify(
    manifest,
    null,
    2
  )}\n\nexport const monthlySummary = ${JSON.stringify(
    monthlySummary,
    null,
    2
  )}\n\nexport const gameMeta = ${JSON.stringify(
    gameMeta,
    null,
    2
  )}\n\nexport const sampleGames = ${JSON.stringify(
    sampleGames,
    null,
    2
  )}\n`

  writeFileSync(join(generatedDir, 'index.js'), fileContent)

  mkdirSync(pgnByMonthDir, { recursive: true })
  for (const [month, map] of pgnByMonth.entries()) {
    const filePath = join(pgnByMonthDir, `${month}.json`)
    writeFileSync(filePath, JSON.stringify(map))
  }

  console.log(`Processed ${records.length} rows, captured ${gameMeta.length} games.`)
}

main().catch((error) => {
  console.error('Failed to build chess data package')
  console.error(error)
  process.exit(1)
})
