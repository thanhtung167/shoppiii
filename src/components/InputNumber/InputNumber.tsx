import {forwardRef, InputHTMLAttributes} from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly errorMessage?: string
  readonly classNameInput?: string
  readonly classNameError?: string
}
const InputNumber = forwardRef<HTMLInputElement,InputNumberProps>(function InputNumberInner ({
  errorMessage,
  className,
  classNameInput = 'w-full p-3 outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
  classNameError = 'mt-1 text-red-600 min-h-[1rem] text-xs',
  onChange,
  ...rest
},ref) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if ((value === '' || /^\d+$/.test(value)) && onChange) {
      onChange(e)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} onChange={handleChange} {...rest} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
