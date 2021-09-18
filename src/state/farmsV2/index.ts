/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import farmsV2Config from 'config/constants/farmsV2'
import newFetchGauges from './fetchGauges'
import {
  fetchFarmV2UserEarnings,
  fetchFarmV2UserAllowances,
  fetchFarmV2UserTokenBalances,
  fetchFarmV2UserStakedBalances,
  fetchFarmV2UserWeight,
  fetchFarmV2UserCurrentWeights
} from './fetchFarmUserV2'
import { FarmsV2State, Farm, Gauge } from '../types'

const initialState: FarmsV2State = { data: [...farmsV2Config] }
export const farmsV2Slice = createSlice({
  name: 'FarmsV2',
  initialState,
  reducers: {
    setFarmsV2PublicData: (state, action) => {
      const liveFarmsData: Gauge[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    },
    setFarmV2UserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      // console.log("arrayOfUserDataObjects", arrayOfUserDataObjects)
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
    },
  },
})

// Actions
export const { setFarmsV2PublicData, setFarmV2UserData } = farmsV2Slice.actions

// Thunks

export const fetchFarmsV2DataAsync = () => async (dispatch) => {
  const farms = await newFetchGauges()
  dispatch(setFarmsV2PublicData(farms))
}
export const fetchFarmsV2UserDataAsync = (account) => async (dispatch) => {
  const userFarmAllowances = await fetchFarmV2UserAllowances(account)
  const userFarmTokenBalances = await fetchFarmV2UserTokenBalances(account)
  const userStakedBalances = await fetchFarmV2UserStakedBalances(account)
  const userFarmEarnings = await fetchFarmV2UserEarnings(account)
  const userWeights = await fetchFarmV2UserWeight(account)
  const userCurrentWeights = await fetchFarmV2UserCurrentWeights(account)


  const arrayOfUserDataObjects = userFarmAllowances.map((farmAllowance, index) => {
    return {
      index,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userFarmEarnings[index],
      userWeights: userWeights[index],
      userCurrentWeights: userCurrentWeights[index]
    }
  })
  dispatch(setFarmV2UserData({ arrayOfUserDataObjects }))
}

export default farmsV2Slice.reducer
