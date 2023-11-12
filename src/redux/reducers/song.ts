import { createSlice } from "@reduxjs/toolkit"

const songSlice = createSlice({
  name: "song",
  initialState: null,
  reducers: {
    setCurrentlyPlaying: (state, action) => {
      console.log("From reducer! " + JSON.stringify(action.payload))
      return action.payload
    },
  },
})

export const { setCurrentlyPlaying } = songSlice.actions
export default songSlice.reducer
