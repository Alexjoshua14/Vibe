'use client'

import { FC } from 'react'
import { Provider } from 'react-redux'
import { SessionProvider } from 'next-auth/react'

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