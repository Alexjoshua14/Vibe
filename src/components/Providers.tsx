'use client'

import { FC } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Provider } from 'react-redux'
import store from './store';

interface ProvidersProps {
  children: React.ReactNode
}

const Providers: FC<ProvidersProps> = ({ children }) => {

  return (
    <Provider store={store}>
      <SessionProvider>
        {children}
      </SessionProvider>
    </Provider>
  )
}

export default Providers;