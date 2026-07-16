export type Separator = 'newline' | 'comma' | 'space' | 'tab' | 'semicolon'

export type SetId = string

export type SetInput = {
  id: SetId
  name: string
  data: string
  separator: Separator
}

export type ProcessedSet = SetInput & {
  uniqueValues: string[]
  uniqueCount: number
  totalCount: number
  frequency: Record<string, number>
  parsedValues: string[]
}

export type OperationResults = {
  differences: Record<string, string[]>
  intersections: Record<string, string[]>
  unions: Record<string, string[]>
}

export type SmartStats = {
  commonAcrossAll: string[]
  uniqueToEachSet: Record<string, string[]>
  valueDistribution: Record<string, string[]>
  summary: {
    totalUniqueValues: number
    setCounts: { id: string; uniqueCount: number; totalCount: number }[]
    commonCount: number
    uniqueDistribution: { id: string; count: number }[]
  }
}

export type ExampleKey = 'countries' | 'numbers' | 'fruits'

export type ResultTab = 'operations' | 'smartStats' | 'visualization'

export type SeparatorOption = {
  value: Separator
  label: string
}
