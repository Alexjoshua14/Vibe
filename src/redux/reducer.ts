
import { createReducer, createAction } from "@reduxjs/toolkit"

const increment = createAction('counter/incremenet');
const decrement = createAction('counter/decrement');


const initialState = { value: 0 }

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(increment, (state, action) => {
      state.value++;
    })
    .addCase(decrement, (state, action) => {
      state.value--;
    })
})

export default reducer;