import { useEffect, useState } from 'react'
import  range  from 'lodash/range'
import * as React from 'react'

interface Props {
  onChange?: (value: Date) => void
  error?: string
  value?: Date
}

function DaySelect({ onChange, value, error }: Props) {
  const [date, setDate] = useState({
    date: value?.getDay() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })
  useEffect(() => {
    if (value) {
      setDate({
        date: value?.getDate(),
        month: value?.getMonth(),
        year: value?.getFullYear()
      })
    }
  }, [value])
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value:valueFromSelect, name } = e.target
    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number( valueFromSelect)
    }
    setDate(newDate)
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }
  return (
    <div>
      <div className='justify-between flex'>
        <select
          name={'date'}
          onChange={handleChange}
          value={value?.getDate() || date.date }
          className='h10 w-[32%] rounded-sm p-2 border border-gray-300 hover:border-orange cursor-pointer '
        >
          <option disabled>Ngày</option>
          {range(1, 32).map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={value?.getMonth() || date.month}
          name={'month'}
          onChange={handleChange}
          className='h10 w-[32%] rounded-sm p-2 border border-gray-300 hover:border-orange cursor-pointer'
        >
          <option disabled>Tháng</option>
          {range(0, 12).map((item) => (
            <option value={item} key={item}>
              {item + 1}
            </option>
          ))}
        </select>
        <select
          value={value?.getFullYear() || date.year}
          name={'year'}
          onChange={handleChange}
          className='h10 w-[32%] rounded-sm p-2 border border-gray-300 hover:border-orange cursor-pointer'
        >
          <option disabled>Năm</option>
          {range(1990, 2026).map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className={'mt-1 text-red-600 min-h-[1rem] text-xs'}>{error}</div>
    </div>
  )
}

export default DaySelect
