declare interface OpenProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

declare interface OpenPropsWithData<T> {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: T | null
}

