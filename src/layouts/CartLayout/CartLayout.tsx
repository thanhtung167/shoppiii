import Footer from '../../components/Footer'
import * as React from 'react'
import CartHeader from '../../components/CartHeader'
interface Props {
  children?: React.ReactNode
}
function CartLayout({ children }: Readonly<Props>) {
  return (
    <div>
      <CartHeader />
      {children}
      <Footer />
    </div>
  )
}

export default CartLayout
