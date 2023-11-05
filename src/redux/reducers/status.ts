
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { Status } from "@/lib/validators/context"

const statusSlice = createSlice({
  name: 'status',
  initialState: 'IDLE',
  reducers: {
    setStatus: (state, action: PayloadAction<Status>) => {
      return action.payload
    }
  }
})

export const { setStatus } = statusSlice.actions
export default statusSlice.reducer