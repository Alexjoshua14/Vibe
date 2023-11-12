import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { CurrentlyPlaying } from "@/lib/validators/spotify"

const currentlyPlayingSlice = createSlice({
  name: "currentlyPlaying",
  initialState: null,
  reducers: {
    setCurrentlyPlaying: (state, action) => {
      return action.payload
    },
  },
})

export const { setCurrentlyPlaying } = currentlyPlayingSlice.actions
export default currentlyPlayingSlice.reducer
