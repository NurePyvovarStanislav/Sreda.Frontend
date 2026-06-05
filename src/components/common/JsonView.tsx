import { Code, ScrollArea } from '@mantine/core'

interface JsonViewProps {
  data: unknown
  maxHeight?: number
}

export function JsonView({ data, maxHeight = 320 }: JsonViewProps) {
  const formatted = JSON.stringify(data, null, 2)

  return (
    <ScrollArea.Autosize mah={maxHeight} type="auto">
      <Code block>{formatted}</Code>
    </ScrollArea.Autosize>
  )
}
