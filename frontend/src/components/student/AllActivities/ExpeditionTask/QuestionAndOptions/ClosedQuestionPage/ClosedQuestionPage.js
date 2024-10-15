import React, { useRef, useState } from 'react'

import { Col, Row } from 'react-bootstrap'
import { connect } from 'react-redux'

import answerSaver from '../answerSaver'
import { Answer, ButtonRow, QuestionCard } from '../QuestionAndOptionsStyle'

function ClosedQuestionPage(props) {
  const answersParent = useRef(null)

  // this array should only have an id
  const [userAnswers, setUserAnswers] = useState([])

  const updateUserAnswers = () => {
   
    const answersUpperRow = Array.from(answersParent.current.children[0].children)
    const answersLowerRow = Array.from(answersParent.current.children[1].children)

    const answersInputsUpperRow = answersUpperRow.map((answer) => answer.children[0].children[0].children[0]);
    const answersInputsLowerRow = answersLowerRow.map((answer) => answer.children[0].children[0].children[0]);

    const chosenAnswersUR = answersInputsUpperRow.filter((input) => input.checked).map((element) => ({ id: +element.value }));
    const choseAnswersLR = answersInputsLowerRow.filter((input) => input.checked).map((element) => ({ id: +element.value }));

    const chosenAnswers = [...chosenAnswersUR, ...choseAnswersLR];

    setUserAnswers(chosenAnswers)
  }

  const saveAnswer = () => {
    answerSaver(userAnswers, props.question.type, props.expeditionId, props.question.id, props.reloadInfo)
  }

  return (
    <>
    <Row
      style={{
        margin: 50,
        marginTop: 0,
        // marginBottom: 100,
        height: '50%',
        // border: '2px solid red'
      }}
    >
      {/* <Col lg={8}> */}
    <QuestionCard $fontColor={props.theme.font} $background={props.theme.primary}>
        <div>{props.question.hint}</div>
        <div>
        <p>{props.question.content}</p>
        </div>
        <div>Punkty: {props.question.points}</div>
    </QuestionCard>    
    </Row>

    <Row
        style={{
            margin: 30,
            // height: '40%',
            // border: '2px solid blue'
        }}
        ref={answersParent}
    >
        <Row>
        {props.question.options.map((answer,index) => (
            index % 2 === 0 && (
                <Col lg={4} className='py-lg-0 py-3' >
                <Answer
                $background={props.theme.primary}
                $fontColor={props.theme.font}
                key={answer.id}
                className='mx-lg-0 mx-auto'
            >
                <Col xxl={1} xs={2} onChange={() => updateUserAnswers()}>
                <input
                    name='answer'
                    type={props.question.type === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
                    value={answer.id}
                />
        
                </Col>
                <Col xxl={11} xs={10}>
                {answer.content}
                </Col>
            </Answer>
            </Col>
            )
        ))}
        </Row>

        <Row>
        {props.question.options.map((answer,index) => (
            index % 2 === 1 && (
                <Col lg={4} className='py-lg-0 py-3'>  
                <Answer
                $background={props.theme.primary}
                $fontColor={props.theme.font}
                key={answer.id}
                className='mx-lg-0 mx-auto'
            >
                <Col xxl={1} xs={2} onChange={() => updateUserAnswers()}>
                <input
                    name='answer'
                    type={props.question.type === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
                    value={answer.id}
                />
        
                </Col>
                <Col xxl={11} xs={10}>
                {answer.content}
                </Col>
            </Answer>
            </Col>
            )
        ))}
        </Row>        
    </Row>
    <Row>
        <ButtonRow $background={props.theme.success}>
            <button onClick={() => saveAnswer()}>
            Wyślij
            </button>
        </ButtonRow>
    </Row>
    </>
  )
}

function mapStateToProps(state) {
  const {theme} = state

  return { theme }
}
export default connect(mapStateToProps)(ClosedQuestionPage)
