export type PrototypeVariant =
  | 'row-control'
  | 'cell-clear'
  | 'overview-page'
  | 'details'

export type RemoveRowVariant = Extract<
  PrototypeVariant,
  'row-control' | 'cell-clear'
>

export const PROTOTYPE_VARIANTS: {
  value: PrototypeVariant
  label: string
}[] = [
  { value: 'row-control', label: 'Variant 1: Row remove control' },
  { value: 'cell-clear', label: 'Variant 2: Clear via cell buttons' },
  { value: 'overview-page', label: 'Variant 3: Overview page' },
  { value: 'details', label: 'Variant 4: Details' },
]

export function isRemoveRowVariant(
  variant: PrototypeVariant,
): variant is RemoveRowVariant {
  return variant === 'row-control' || variant === 'cell-clear'
}

export function isFullPageVariant(
  variant: PrototypeVariant,
): variant is 'overview-page' | 'details' {
  return variant === 'overview-page' || variant === 'details'
}
