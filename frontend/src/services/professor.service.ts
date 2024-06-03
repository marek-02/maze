import {
  ADD_FILE,
  DELETE_USER_PROFESSOR,
  GET_FILE_LOG,
  GET_GRADES,
  GET_POINTS_ALL_LIST_PROFESSOR,
  GET_PROFESSOR_EMAILS,
  GET_PROFESSOR_REGISTER_TOKEN,
  GET_SUMMARY,
  GET_TASK_EVALUATE_ALL,
  GET_TASK_EVALUATE_FIRST,
  POST_ADDITIONAL_POINTS, POST_COLLOQUIUM_POINTS,
  POST_FEEDBACK_PROFESSOR, POST_LABORATORY_POINTS,
  POST_TASK_RESULT_CSV,
  PUT_HERO
} from './urls'
import { parseJwt } from '../utils/Api'
import {
  axiosApiDelete,
  axiosApiGet,
  axiosApiGetFile,
  axiosApiMultipartPost,
  axiosApiPost,
  axiosApiPut
} from '../utils/axios'

class ProfessorService {
  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  getEmail() {
    return parseJwt(this.getUser().access_token).sub
  }

  getCSVGradesFile(studentsId: number[], activitiesId: number[]) {
    return axiosApiGetFile(POST_TASK_RESULT_CSV, { studentIds: studentsId, activityIds: activitiesId }).catch(
      (error) => {
        throw error
      }
    )
  }

  getTasksToEvaluateList(courseId: number) {
    return axiosApiGet(`${GET_TASK_EVALUATE_ALL}?courseId=${courseId}`).catch((error) => {
      throw error
    })
  }

  getFirstTaskToEvaluate(taskId: number) {
    return axiosApiGet(GET_TASK_EVALUATE_FIRST, { fileTaskId: taskId }).catch((error) => {
      throw error
    })
  }

  sendTaskEvaluation(taskId: number, remarks: string, points: number, file: any, fileName: string) {
    return axiosApiMultipartPost(POST_FEEDBACK_PROFESSOR, {
      fileTaskResultId: taskId,
      content: remarks,
      points,
      file,
      fileName
    }).catch((error) => {
      throw error
    })
  }



  sendPoints(studentId: number,courseId: number, points: number, description: string, activityType: string,role:string,annihilatedPoints:number, annihilatedQuestions:number,dateInMillis: number) {
      switch (activityType) {
        case 'first_colloquium':
          return this.sendColloquiumPoints(studentId, courseId, points, description, 1 ,annihilatedPoints,annihilatedQuestions,dateInMillis);
        case 'second_colloquium':
          return this.sendColloquiumPoints(studentId, courseId, points, description, 2 ,annihilatedPoints,annihilatedQuestions,dateInMillis);
        case 'hands-on-colloquium':
          return this.sendColloquiumPoints(studentId, courseId, points, description, 3 ,0,0,dateInMillis);
        case 'oral-colloquium':
          return this.sendColloquiumPoints(studentId, courseId, points, description, 4 ,annihilatedPoints,annihilatedQuestions,dateInMillis);
        case 'laboratory_points':
          return this.sendLaboratoryPoints(studentId, courseId, points, description, role, dateInMillis);
        case 'additional-points':
          return this.sendBonusPoints(studentId, courseId, points, description, dateInMillis);
        default:
          throw new Error(`Invalid activity type: ${activityType}`);
      }
  }


  sendBonusPoints(studentId: number,courseId: number, points: number, description: string, dateInMillis: number) {
    return axiosApiPost(POST_ADDITIONAL_POINTS, {
      studentId,
      courseId,
      points,
      description,
      dateInMillis
    }).catch((error) => {
      throw error
    })
  }

  sendLaboratoryPoints(studentId: number,courseId: number, points: number, description: string, role:string, dateInMillis: number) {
    return axiosApiPost(POST_LABORATORY_POINTS, {
      studentId,
      courseId,
      points,
      description,
      role,
      dateInMillis
    }).catch((error) => {
      throw error
    })
  }

  sendColloquiumPoints(studentId: number,courseId: number, points: number, description: string, colloquiumNumber: number,annihilatedQuestions:number, annihilatedPoints:number, dateInMillis: number) {
    return axiosApiPost(POST_COLLOQUIUM_POINTS, {
      studentId,
      courseId,
      points,
      description,
      colloquiumNumber,
      annihilatedQuestions,
      annihilatedPoints,
      dateInMillis
    }).catch((error) => {
      throw error
    })
  }

  getStudentPointsList(studentEmail: string) {
    return axiosApiGet(GET_POINTS_ALL_LIST_PROFESSOR, { studentEmail }).catch((error) => {
      throw error
    })
  }

  getGameSummaryStats(courseId: number) {
    return axiosApiGet(`${GET_SUMMARY}?courseId=${courseId}`).catch((error) => {
      throw error
    })
  }

  getRegistrationToken() {
    return axiosApiGet(GET_PROFESSOR_REGISTER_TOKEN).catch((error) => {
      throw error
    })
  }

  getStudentGrades(courseId: number) {
    return axiosApiGet(`${GET_GRADES}?courseId=${courseId}`).catch((error) => {
      throw error
    })
  }

  deleteAccount(newProfessorEmail: string) {
    return axiosApiDelete(DELETE_USER_PROFESSOR, { professorEmail: newProfessorEmail }).catch((error) => {
      throw error
    })
  }

  getProfessorsEmails() {
    return axiosApiGet(GET_PROFESSOR_EMAILS).catch((error) => {
      throw error
    })
  }

  getLogsFile() {
    return axiosApiGet(GET_FILE_LOG).catch((error) => {
      throw error
    })
  }

  addAttachmentFileTask(body: any) {
    return axiosApiMultipartPost(ADD_FILE, body)
  }
}

export default new ProfessorService()
