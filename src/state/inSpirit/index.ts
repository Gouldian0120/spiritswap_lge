/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import fetchInspirit from './fetchInspirit'


const initialState = { data: [] }
export const InSpiritSlice = createSlice({
  name: 'InSpirit',
  initialState,
  reducers: {
    setInspiritData: (state, action) => {
        const inSpiritData = action.payload
        state.data = inSpiritData
    }
  },
})

// Actions
export const { setInspiritData } = InSpiritSlice.actions

// Thunks
export const fetchInSpiritDataAsync = (account) => async (dispatch) => {
  const inSpiritData = await fetchInspirit(account)
  dispatch(setInspiritData(inSpiritData))
}

export default InSpiritSlice.reducer
