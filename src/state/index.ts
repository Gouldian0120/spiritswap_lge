import { configureStore } from '@reduxjs/toolkit'
import farmsReducer from './farms'
import farmsV2Reducer from './farmsV2'
import inSpiritReducer from './inSpirit'
import toastsReducer from './toasts'
import poolsReducer from './pools'
import pricesReducer from './prices'
import profileReducer from './profile'
import teamsReducer from './teams'
import achievementsReducer from './achievements'

export default configureStore({
  devTools: false,
  reducer: {
    farms: farmsReducer,
    farmsV2: farmsV2Reducer,
    inSpirit: inSpiritReducer,
    toasts: toastsReducer,
    pools: poolsReducer,
    prices: pricesReducer,
    profile: profileReducer,
    teams: teamsReducer,
    achievements: achievementsReducer,
  },
  
})
