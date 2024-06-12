import {
  GET_COLLOQUIUM_DETAILS,
  PUT_COLLOQUIUM_POINTS
} from './urls'

import { axiosApiGet, axiosApiPut } from '../utils/axios'

class ConfigService {

  getColloquiumDetailsById(colloquiumId: number) {
    return axiosApiGet(`${GET_COLLOQUIUM_DETAILS}/${colloquiumId}`).catch((error) => {
      throw error
    })
  }

  getColloquiumDetailsByName(colloquiumName: string) {
    return axiosApiGet(`${GET_COLLOQUIUM_DETAILS}/${colloquiumName}`).catch((error) => {
      throw error
    })
  }

  getAllDetails() {
    return axiosApiGet(GET_COLLOQUIUM_DETAILS).catch((error) => {
      throw error
    })
  }

  editColloquiumDetails(colloquiumName: string, annihilatedLimit: number, questionPoints: number[]) {
    return axiosApiPut(`${PUT_COLLOQUIUM_POINTS}/${colloquiumName}`, {
      annihilatedLimit,
      questionPoints
    }).catch((error) => {
      throw error
    })
  }
}

export default new ConfigService()
