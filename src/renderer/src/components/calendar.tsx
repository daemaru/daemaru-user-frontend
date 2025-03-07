import { Logo } from '@renderer/assets'
import { changeDate } from '@renderer/function/getCalendar'
import { DayOfTheWeek, Event } from '@renderer/types/enum'
import { useState } from 'react'

interface PropsType {
  events: Event[]
  year: number
  month: number
}

const Calendar = ({ events, year, month }: PropsType) => {
  const weeks = changeDate(year, month)
  const weekCount = weeks.length
  const [selectDay, setSelectDay] = useState(new Date().getDate())

  const getWeekBoundaries = (weekDates: (number | string)[]) => {
    const firstValidDate = weekDates.find((date) => date !== '') as number
    const weekStart = new Date(year, month - 1, firstValidDate)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return { weekStart, weekEnd }
  }

  const assignEventPositions = (weekEvents: Event[], weekDates: (number | string)[]) => {
    const { weekStart, weekEnd } = getWeekBoundaries(weekDates)
    const eventPositions: { [key: string]: number } = {}
    const eventRows: { [key: number]: Event[] } = {}

    // 시작일 기준으로 정렬
    const sortedEvents = [...weekEvents].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    )

    sortedEvents.forEach((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      const adjustedStart = new Date(Math.max(eventStart.getTime(), weekStart.getTime()))
      const adjustedEnd = new Date(Math.min(eventEnd.getTime(), weekEnd.getTime()))

      // 겹치지 않는 첫 번째 행 찾기
      let row = 0
      while (true) {
        const rowEvents = eventRows[row] || []
        const isOverlapping = rowEvents.some((existingEvent) => {
          const existingStart = new Date(
            Math.max(new Date(existingEvent.start).getTime(), weekStart.getTime())
          )
          const existingEnd = new Date(
            Math.min(new Date(existingEvent.end).getTime(), weekEnd.getTime())
          )

          return adjustedStart <= existingEnd && adjustedEnd >= existingStart
        })

        if (!isOverlapping) {
          eventRows[row] = [...(eventRows[row] || []), event]
          eventPositions[event.id] = row
          break
        }
        row++
      }
    })

    return { eventPositions, rowCount: Object.keys(eventRows).length }
  }

  const getWeekEvents = (weekDates: (number | string)[]) => {
    if (!weekDates.some((date) => date !== '')) return []

    const { weekStart, weekEnd } = getWeekBoundaries(weekDates)

    return events.filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      return eventStart <= weekEnd && eventEnd >= weekStart
    })
  }

  const calculateEventPosition = (event: Event, weekDates: number[]) => {
    const { weekStart, weekEnd } = getWeekBoundaries(weekDates)
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    const effectiveStart = eventStart < weekStart ? weekStart : eventStart
    const effectiveEnd = eventEnd > weekEnd ? weekEnd : eventEnd

    const startOffset = Math.floor(
      (effectiveStart.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)
    )
    const duration =
      Math.floor((effectiveEnd.getTime() - effectiveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1

    return {
      startOffset,
      duration,
      isStartOfEvent: eventStart >= weekStart,
      isEndOfEvent: eventEnd <= weekEnd
    }
  }

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-grow">
        <div className="flex">
          {DayOfTheWeek.map((el) => (
            <div className="flex-1 p-3">{`${el}요일`}</div>
          ))}
        </div>
        <div
          className="flex-1"
          style={{ display: 'grid', gridTemplateRows: `repeat(${weekCount}, 1fr)` }}
        >
          {weeks.map((week, i) => {
            const weekEvents = getWeekEvents(week)
            const { eventPositions, rowCount } = assignEventPositions(weekEvents, week)

            return (
              <div className="relative" key={i}>
                <div className="grid h-full grid-cols-7">
                  {week.map((date, j) => {
                    const isNowMonth = !((i === 0 && date >= 23) || (i >= 3 && date <= 6))
                    return (
                      <div
                        className={`${isNowMonth ? '' : 'text-[#a1a1aa]'} ${isNowMonth && date === selectDay ? 'text-[#ff8a3d] bg-[#fff3ec]' : ''} flex px-3 py-3 border-y`}
                        key={j}
                        onClick={() => setSelectDay(date)}
                      >
                        {date}
                      </div>
                    )
                  })}
                </div>
                <div className="absolute left-0 right-0 top-8">
                  {weekEvents.map((event) => {
                    const { startOffset, duration, isStartOfEvent, isEndOfEvent } =
                      calculateEventPosition(event, week)
                    const rowPosition = eventPositions[event.id]
                    return (
                      <div
                        key={event.id}
                        className="absolute h-4 overflow-hidden text-xs rounded-md cursor-pointer hover:opacity-90 bg-[#ffdbc3] text-black flex items-center gap-1"
                        style={{
                          left: `${(startOffset * 100) / 7}%`,
                          width: `${(duration * 100) / 7}%`,
                          top: `${rowPosition * 17}px`,
                          padding: '1px 4px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          borderTopLeftRadius: isStartOfEvent ? '0.375rem' : 0,
                          borderBottomLeftRadius: isStartOfEvent ? '0.375rem' : 0,
                          borderTopRightRadius: isEndOfEvent ? '0.375rem' : 0,
                          borderBottomRightRadius: isEndOfEvent ? '0.375rem' : 0
                        }}
                        title={event.title}
                      >
                        {isStartOfEvent ? (
                          <div className="rounded-full bg-[#ff8a3d] w-1 h-1"></div>
                        ) : (
                          ''
                        )}
                        {isStartOfEvent ? event.title : ''}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col items-center w-48 gap-4 px-3 mt-10">
        {events.map((event) => {
          if (event.start.getDate() <= selectDay && event.end.getDate() >= selectDay) {
            return (
              <div className="flex flex-col w-full shrink-0">
                <div className="flex items-center gap-1">
                  <div className="rounded-full bg-[#ff8a3d] w-1 h-1"></div>
                  <span>{event.title}</span>
                </div>
                <span className="px-2 text-sm">{event.description}</span>
                <div className="px-2 flex flex-col text-[#71717a] text-xs">
                  <span>{`시간: ${event.period}`}</span>
                  <span>{`장소: ${event.location}`}</span>
                  <span>{`대상: ${event.target}`}</span>
                </div>
              </div>
            )
          }
        })}
        <Logo fill="black" className="absolute w-13 bottom-6 right-3" />
      </div>
    </div>
  )
}

export default Calendar
