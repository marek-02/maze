import ExpeditionService from '../../../../../services/expedition.service'
import { QuestionType , EXPEDITION_STATUS } from '../../../../../utils/constants'

const getAnswerForm = (questionType, userAnswer) => {
  let idList = null
  switch (questionType) {
    case QuestionType.OPEN_QUESTION:
      return { optionIds: idList, openAnswer: userAnswer }
    case QuestionType.SINGLE_CHOICE:
      idList = userAnswer[0] !== undefined ? [userAnswer[0].id] : []
      return { optionIds: idList, openAnswer: null }
    case QuestionType.MULTIPLE_CHOICE:
      idList = userAnswer.map((answer) => answer.id)
      return { optionIds: idList, openAnswer: null }
    default:
 
  }
}

export default function answerSaver(userAnswer, questionType, expeditionId, questionId, reloadInfo) {
  let acceptWarning = null

  if (!userAnswer || userAnswer.length === 0) {
    acceptWarning = window.confirm('Nie podałeś żadnej odpowiedzi. Czy na pewno chcesz przejść dalej?')
  }

  // acceptWarning == null || acceptWarning === true
  if (acceptWarning !== false) {
    const result = {
      status: EXPEDITION_STATUS.ANSWER,
      graphTaskId: expeditionId,
      questionId,
      answerForm: getAnswerForm(questionType, userAnswer)
    }
    ExpeditionService.sendAction(result).then(() => reloadInfo())
  }
}
