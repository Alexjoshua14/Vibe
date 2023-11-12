import { configureStore } from "@reduxjs/toolkit"

import currentlyPlayingReducer from "@/redux/reducers/currentlyPlaying"
import searchSlice from "@/redux/reducers/search"
import statusReducer from "@/redux/reducers/status"

const store = configureStore({
  reducer: {
    currentlyPlaying: currentlyPlayingReducer,
    status: statusReducer,
    search: searchSlice,
  },
})

export default store
