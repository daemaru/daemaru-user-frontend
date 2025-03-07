import { Archive, Event } from '@renderer/types/enum'

interface Context {
  title?: string
  start?: Date
  end?: Date
  period?: string
  location?: string
  description?: string
  target?: string
  [key: string]: string | Date | undefined
}

const contextTransform = (context: string[]): Context => {
  const event: Context = {}
  context.forEach((el) => {
    const [key, valueStr] = el.split(':')
    if (key === 'start' || key === 'end') {
      const [year, month, day] = valueStr.split('-')
      event[key] = new Date(+year, +month - 1, +day)
    } else {
      event[key] = valueStr
    }
  })

  return event
}

export const archiveTransform = (archive: Archive): Event => {
  const event: Event = {
    id: archive.schedule_id,
    title: '',
    start: new Date(),
    end: new Date(),
    period: '',
    location: '',
    description: '',
    target: ''
  }

  const context = contextTransform(archive.context)

  if (context.title) event.title = context.title as string
  if (context.start) event.start = context.start as Date
  if (context.end) event.end = context.end as Date
  if (context.description) event.description = context.description as string
  if (context.location) event.location = context.location as string
  if (context.period) event.period = context.period as string
  if (context.target) event.target = context.target as string

  return event
}

export interface Response {
  id: string
  title: string
  start: string
  end: string
  period: string
  location: string
  description: string
  target: string
}
export const eventTransform = (response?: Response[]) => {
  if (!response) return []
  return response.map((ev) => {
    const [startYear, startMonth, startDay] = ev.start.split('-').map(Number)
    const [endYear, endMonth, endDay] = ev.end.split('-').map(Number)
    return {
      ...ev,
      start: new Date(startYear, startMonth - 1, startDay),
      end: new Date(endYear, endMonth - 1, endDay)
    }
  })
}
