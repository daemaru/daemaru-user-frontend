import { Arrow, Logo } from './assets'
import Calendar from './components/calendar'
import Day from './components/day'
import { changeDate } from './function/getCalendar'
import { useEffect, useState } from 'react'
import { DayOfTheWeek, Months, Event } from './types/enum'
import { eventTransform } from './function/eventTransform'
import { getSchedules } from './apis/schedules'
import { useSchedules } from './hooks/useSchedules'

const today = new Date()

function App() {
  const [showSidebar, setShowSidebar] = useState(true)
  const sideCalendar = [today.getFullYear(), today.getMonth() + 1]
  const sideCalendarData = changeDate(sideCalendar[0], sideCalendar[1])
  const [selectMonth, setSelectMonth] = useState([today.getFullYear(), today.getMonth()])
  const { data } = useSchedules()
  const [event, setEvent] = useState<Event[]>([])

  useEffect(() => {
    setEvent(eventTransform(data?.schedules))
  }, [data])

  useEffect(() => {
    const handleResize = () => {
      setShowSidebar(window.innerHeight > 720 && window.innerWidth > 1080)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="flex w-screen h-screen">
      {showSidebar && (
        <div className="flex flex-col h-screen p-10 text-white bg-custom-bg w-fit min-w-[450px]">
          <Logo />
          <div className="flex flex-col gap-2 mt-16">
            <span className="text-lg">오늘의 명언</span>
            <h3 className="text-4xl font-semibold">
              삶이 있는 한<br /> 희망은 있다 - 키케로
            </h3>
          </div>
          <div className="flex flex-col mt-12">
            <span className="text-2xl font-semibold">{`${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`}</span>
            <div className="flex justify-between w-full mt-3">
              {DayOfTheWeek.map((day) => (
                <div className="flex items-center justify-center w-9 h-9">{day}</div>
              ))}
            </div>
            <div className="flex flex-col justify-between w-full h-full bg-transparent/5">
              {sideCalendarData.map((week, i) => (
                <div className="flex justify-between" key={i}>
                  {week.map((date, j) => (
                    <Day date={date} week={i} key={j} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-4 overflow-y-scroll scrollbar-none">
            {event.map((schedule) => {
              if (
                schedule.start.getMonth() === today.getMonth() ||
                schedule.end.getMonth() === today.getMonth()
              ) {
                return (
                  <div className="flex items-center gap-2">
                    <div className="bg-[#ff8a3d] w-2 h-2 rounded-full"></div>
                    <div>{schedule.title}</div>
                  </div>
                )
              }
            })}
          </div>
        </div>
      )}
      <div className="flex flex-col w-full">
        <div className="px-10 py-7">
          <div className="flex items-center gap-8">
            <Arrow
              direction="left"
              onClick={() =>
                selectMonth[1] === 0
                  ? setSelectMonth([selectMonth[0] - 1, 11])
                  : setSelectMonth([selectMonth[0], selectMonth[1] - 1])
              }
            />
            <Arrow
              direction="right"
              onClick={() =>
                selectMonth[1] === 11
                  ? setSelectMonth([selectMonth[0] + 1, 0])
                  : setSelectMonth([selectMonth[0], selectMonth[1] + 1])
              }
            />
            <span className="text-2xl font-semibold text-[#ff8a3d]">{Months[selectMonth[1]]}</span>
          </div>
        </div>
        <Calendar events={event} year={selectMonth[0]} month={selectMonth[1] + 1} />
      </div>
    </div>
  )
}

export default App
