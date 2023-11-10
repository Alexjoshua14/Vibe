import { createSlice } from "@reduxjs/toolkit";


const searchSlice = createSlice({
  name: 'search',
  initialState: { searching: false },
  reducers: {
    setSearching: (state, action) => action.payload
  }
})

export const { setSearching } = searchSlice.actions
export default searchSlice.reducer