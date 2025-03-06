export const DayOfTheWeek = ['일', '월', '화', '수', '목', '금', '토']
export const Months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

export interface Event {
  id: string
  title: string
  start: Date
  end: Date
  period: string
  location: string
  description: string
  target: string
}

export interface Archive {
  index: number
  schedule_id: string
  command: 'CREATE' | 'UPDATE' | 'DELETE'
  context: string[]
}
