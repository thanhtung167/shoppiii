import InputNumber, { InputNumberProps } from '../InputNumber'
import { useState } from 'react'
import * as React from 'react'

interface Props extends InputNumberProps {
  max?: number
  onType?: (value: number) => void
  onIncrease?: (value:number) => void
  onDecrease?: (value:number) => void
  onFocusOut?:(value:number) => void
  classNameWrapper?: string
}

export default function QuantityController({max,onIncrease,onDecrease,onType,classNameWrapper,onFocusOut,value,...rest}:Props) {
  const [localValue, setLocalValue] = useState<number>(Number(value || 0))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(e.target.value)
    if( max !== undefined && _value > max ){
      _value = max
    }else if(_value < 1){
      _value = 1
    }
    if(onType && onType(_value)){
      onType(_value)
      setLocalValue(_value)
    }
  }
  const increase = () => {
    let _value = Number(value) + 1
    if (max !== undefined && _value > max) {
      _value = max
    }
    if(onIncrease && onIncrease(_value)){
      onIncrease(_value)
      setLocalValue(_value)
    }

  }
  const decrease = () => {
    let _value = Number(value) - 1
    if (_value < 1) {
      _value = 1
    }
    if(onDecrease &&  onDecrease(_value)){
      onDecrease(_value)
      setLocalValue(_value)
    }

  }

  const handleBlur = (e:React.FocusEvent<HTMLInputElement,Element>) =>{
    const _value = Number(e.target.value)
    if(onFocusOut &&  onFocusOut(_value)){
      onFocusOut(_value)
      setLocalValue(_value)
    }
  }

  return (
    <div className={'flex items-center ' + classNameWrapper}>
      <button
        onClick={decrease}
        className={
          'flex h-8 w-8 items-center justify-center rounded-l-sm  border border-gray-300 text-gray-600'
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
        </svg>
      </button>
      <InputNumber
        value={value}
        classNameError={'hidden'}
        className={'text-orange'}
        classNameInput={' h-8 w-14 border-t border-b p-1 text-center outline-none border-gray-300'}
        onChange={handleChange || localValue}
        onBlur={handleBlur}
        {...rest}

      ></InputNumber>
      <button
        onClick={increase}
        className={
          'flex h-8 w-8 items-center justify-center rounded-r-sm  border border-gray-300 text-gray-600'
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}