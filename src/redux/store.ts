
import  { configureStore } from '@reduxjs/toolkit'

import currentlyPlayingReducer from '@/redux/reducers/currentlyPlaying'
import statusReducer from '@/redux/reducers/status'

const store = configureStore({
  reducer: {
    currentlyPlaying: currentlyPlayingReducer,
    status: statusReducer
  }
})

export default store