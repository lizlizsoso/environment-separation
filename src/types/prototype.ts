export type RemoveRowVariant = 'row-control' | 'cell-clear'

export const REMOVE_ROW_VARIANTS: {
  value: RemoveRowVariant
  label: string
}[] = [
  { value: 'row-control', label: 'Variant 1: Row remove control' },
  { value: 'cell-clear', label: 'Variant 2: Clear via cell buttons' },
]
