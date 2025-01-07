import * as React from 'react'
import RegisterHeader from '../../components/RegisterHeader'
import Footer from '../../components/Footer'

interface Props {
  children?: React.ReactNode
}
export default function RegisterLayout({ children }: Readonly<Props>) {
  return (
    <div>
      <RegisterHeader/>
      {children}
      <Footer/>
    </div>
  )
}
