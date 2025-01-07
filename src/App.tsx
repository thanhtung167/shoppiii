import useRouteElement from './useRouteElement.tsx'
import { ToastContainer } from 'react-toastify'
function App() {
  const routerElement = useRouteElement()
  return (
    <div>
      {routerElement}
      <ToastContainer aria-label={undefined} />
    </div>
  )
}

export default App
