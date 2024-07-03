import { RouterProvider } from 'react-router-dom'
import router from '@/routers/routes'
import { Provider } from 'react-redux'
import { persistor, store } from '@/redux/store'
import { Toaster } from '@/components/ui/sonner'
import { PersistGate } from 'redux-persist/integration/react'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
        <Toaster
          expand={false}
          position='bottom-center'
          duration={2000}
        />
      </PersistGate>
    </Provider>
  )
}

export default App
