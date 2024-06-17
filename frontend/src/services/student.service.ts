import {
  GET_ADDITIONAL_POINTS,
  GET_TASK_RESULT_POINTS_STATISTICS,
  POST_USER_INDEX,
  GET_POINTS_ALL_TOTAL,
  GET_DASHBOARD,
  GET_SOMEONES_DASHBOARD,
  DELETE_USER_STUDENT,
  GET_ALL_MEMBERS,
  POST_USER_SUBGROUP,
  POST_USER_ROLE,

} from './urls'
import { axiosApiDelete, axiosApiGet, axiosApiPost } from '../utils/axios'

class StudentService {

  getPointsStats(courseId: number) {
    return axiosApiGet(`${GET_TASK_RESULT_POINTS_STATISTICS}?courseId=${courseId}`).catch((error) => {
      throw error
    })
  }

  getBonusPointsList(courseId: number) {
    return axiosApiGet(`${GET_ADDITIONAL_POINTS}?courseId=${courseId}`).catch((error) => {
      throw error
    })
  }

  getTotalReceivedPoints(courseId: number) {
    return axiosApiGet(`${GET_POINTS_ALL_TOTAL}?courseId=${courseId}`).catch((error) => {
      throw error
    })
  }

  setIndexNumber(newIndexNumber: number) {
    return axiosApiPost(POST_USER_INDEX, { newIndexNumber }).catch((error) => {
      throw error
    })
  }

  getDashboardStats(courseId: number) {
    return axiosApiGet(`${GET_DASHBOARD}?courseId=${courseId}`).catch((error) => {
      throw error
    })
  }

  getAllMembers(courseId: number){
    return axiosApiGet(`${GET_ALL_MEMBERS}?courseId=${courseId}`).catch((error) => {
      throw error
    })
  }

  getSpecifiedStudentsDashboardStats(userId:number,courseId: number) {
    return axiosApiGet(`${GET_SOMEONES_DASHBOARD}?userId=${userId}&courseId=${courseId}`).catch((error) => {
      throw error
    })
  }

  deleteAccount() {
    return axiosApiDelete(DELETE_USER_STUDENT).catch((error) => {
      throw error
    })
  }

  changeStudentSubgroup(userId: number, newSubgroupId :number, courseId : number){
    return axiosApiPost(`${POST_USER_SUBGROUP}?userId=${userId}&newSubgroupId=${newSubgroupId}&courseId=${courseId}`)   
    .catch((error) => {
      throw error
    })
  }
  changeStudentRole(userId: number, newRoleId :string, courseId : number){
    return axiosApiPost(`${POST_USER_ROLE}?userId=${userId}&newRoleId=${newRoleId}&courseId=${courseId}`)   
    .catch((error) => {
      throw error
    })
  }
}

export default new StudentService()
