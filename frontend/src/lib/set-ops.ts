import type {
  ExampleKey,
  OperationResults,
  ProcessedSet,
  Separator,
  SeparatorOption,
  SetInput,
  SmartStats,
} from '../types/set'

export const SEPARATOR_OPTIONS: SeparatorOption[] = [
  { value: 'newline', label: 'New Line' },
  { value: 'comma', label: 'Comma (,)' },
  { value: 'space', label: 'Space' },
  { value: 'tab', label: 'Tab' },
  { value: 'semicolon', label: 'Semicolon (;)' },
]

export const MAX_SETS = 6

export function createEmptySet(index: number): SetInput {
  const id = String.fromCharCode('A'.charCodeAt(0) + index)
  return {
    id,
    name: `Set ${id}`,
    data: '',
    separator: 'newline',
  }
}

export function createInitialSets(): SetInput[] {
  return [createEmptySet(0), createEmptySet(1)]
}

export function parseInput(input: string, separator: Separator): string[] {
  if (!input.trim()) return []

  let values: string[]
  if (separator === 'newline') {
    values = input.split('\n')
  } else if (separator === 'comma') {
    values = input.split(',')
  } else if (separator === 'space') {
    values = input.split(' ')
  } else if (separator === 'tab') {
    values = input.split('\t')
  } else {
    values = input.split(';')
  }

  return values.map((value) => value.trim()).filter((value) => value !== '')
}

export function calculateFrequency(array: string[]): Record<string, number> {
  const freq: Record<string, number> = {}
  for (const value of array) {
    freq[value] = (freq[value] || 0) + 1
  }
  return freq
}

export function processSet(set: SetInput): ProcessedSet {
  const parsedValues = parseInput(set.data, set.separator)
  const uniqueValues = [...new Set(parsedValues)]
  return {
    ...set,
    uniqueValues,
    uniqueCount: uniqueValues.length,
    totalCount: parsedValues.length,
    frequency: calculateFrequency(parsedValues),
    parsedValues,
  }
}

export function processSets(sets: SetInput[]): ProcessedSet[] {
  return sets.map(processSet)
}

export function calculateSetOperations(processedSets: ProcessedSet[]): OperationResults {
  const differences: Record<string, string[]> = {}
  const intersections: Record<string, string[]> = {}
  const unions: Record<string, string[]> = {}

  for (let i = 0; i < processedSets.length; i++) {
    for (let j = 0; j < processedSets.length; j++) {
      if (i !== j) {
        const setA = processedSets[i]
        const setB = processedSets[j]
        differences[`${setA.id}-${setB.id}`] = setA.uniqueValues.filter(
          (item) => !setB.uniqueValues.includes(item),
        )
      }
    }
  }

  for (let i = 0; i < processedSets.length; i++) {
    for (let j = i + 1; j < processedSets.length; j++) {
      const setA = processedSets[i]
      const setB = processedSets[j]

      intersections[`${setA.id}∩${setB.id}`] = setA.uniqueValues.filter((item) =>
        setB.uniqueValues.includes(item),
      )

      unions[`${setA.id}∪${setB.id}`] = [
        ...new Set([...setA.uniqueValues, ...setB.uniqueValues]),
      ]
    }
  }

  if (processedSets.length >= 3) {
    const allSets = processedSets.map((set) => set.id).join('∩')
    intersections[allSets] = processedSets[0].uniqueValues.filter((item) =>
      processedSets.every((set) => set.uniqueValues.includes(item)),
    )

    unions[processedSets.map((set) => set.id).join('∪')] = [
      ...new Set(processedSets.flatMap((set) => set.uniqueValues)),
    ]
  }

  return { differences, intersections, unions }
}

export function calculateSmartStats(processedSets: ProcessedSet[]): SmartStats {
  const commonAcrossAll =
    processedSets.length > 0
      ? processedSets[0].uniqueValues.filter((item) =>
          processedSets.every((set) => set.uniqueValues.includes(item)),
        )
      : []

  const uniqueToEachSet: Record<string, string[]> = {}
  for (const setA of processedSets) {
    uniqueToEachSet[setA.id] = setA.uniqueValues.filter((item) =>
      processedSets.every(
        (setB) => setB.id === setA.id || !setB.uniqueValues.includes(item),
      ),
    )
  }

  const allValues = [...new Set(processedSets.flatMap((set) => set.uniqueValues))]

  const valueDistribution: Record<string, string[]> = {}
  for (const value of allValues) {
    valueDistribution[value] = processedSets
      .filter((set) => set.uniqueValues.includes(value))
      .map((set) => set.id)
  }

  return {
    commonAcrossAll,
    uniqueToEachSet,
    valueDistribution,
    summary: {
      totalUniqueValues: allValues.length,
      setCounts: processedSets.map((set) => ({
        id: set.id,
        uniqueCount: set.uniqueCount,
        totalCount: set.totalCount,
      })),
      commonCount: commonAcrossAll.length,
      uniqueDistribution: Object.entries(uniqueToEachSet).map(([id, values]) => ({
        id,
        count: values.length,
      })),
    },
  }
}

export function getExampleSets(example: ExampleKey): SetInput[] {
  if (example === 'countries') {
    return [
      {
        id: 'A',
        name: 'North America & Allies',
        data: 'USA\nCanada\nMexico\nFrance\nGermany\nJapan',
        separator: 'newline',
      },
      {
        id: 'B',
        name: 'Europe',
        data: 'France\nGermany\nItaly\nSpain\nUK',
        separator: 'newline',
      },
      {
        id: 'C',
        name: 'Asia-Pacific',
        data: 'Japan\nChina\nIndia\nAustralia\nUK',
        separator: 'newline',
      },
    ]
  }

  if (example === 'numbers') {
    return [
      {
        id: 'A',
        name: 'First Ten',
        data: '1, 2, 3, 4, 5, 6, 7, 8, 9, 10',
        separator: 'comma',
      },
      {
        id: 'B',
        name: 'Middle Group',
        data: '5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15',
        separator: 'comma',
      },
      {
        id: 'C',
        name: 'Last Ten',
        data: '10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20',
        separator: 'comma',
      },
    ]
  }

  return [
    {
      id: 'A',
      name: 'Basket 1',
      data: 'apple orange banana grape pear',
      separator: 'space',
    },
    {
      id: 'B',
      name: 'Basket 2',
      data: 'orange grape kiwi pineapple mango',
      separator: 'space',
    },
    {
      id: 'C',
      name: 'Basket 3',
      data: 'kiwi mango peach cherry apple',
      separator: 'space',
    },
  ]
}

export function reassignSetIds(sets: SetInput[]): SetInput[] {
  return sets.map((set, idx) => {
    const newId = String.fromCharCode('A'.charCodeAt(0) + idx)
    const name =
      set.name === `Set ${set.id}` || set.name === `Set ${newId}`
        ? `Set ${newId}`
        : set.name
    return { ...set, id: newId, name }
  })
}

export type SetColor = { bg: string; border: string }

const SET_COLORS: Record<string, { r: number; g: number; b: number; border: string }> = {
  A: { r: 59, g: 130, b: 246, border: '#3B82F6' },
  B: { r: 34, g: 197, b: 94, border: '#22C55E' },
  C: { r: 249, g: 115, b: 22, border: '#F97316' },
  D: { r: 168, g: 85, b: 247, border: '#A855F7' },
  E: { r: 236, g: 72, b: 153, border: '#EC4899' },
  F: { r: 234, g: 179, b: 8, border: '#EAB308' },
}

export function getSetColor(setId: string, opacity = 1): SetColor {
  const color = SET_COLORS[setId]
  if (!color) {
    return {
      bg: `rgba(75, 85, 99, ${opacity * 0.3})`,
      border: '#4B5563',
    }
  }
  return {
    bg: `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.3})`,
    border: color.border,
  }
}

export const SET_BAR_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-yellow-500',
] as const

export const SET_BADGE_COLORS: Record<string, string> = {
  A: 'bg-blue-500',
  B: 'bg-green-500',
  C: 'bg-orange-500',
  D: 'bg-purple-500',
  E: 'bg-pink-500',
  F: 'bg-yellow-500',
}
