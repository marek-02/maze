import React, { useRef, useState,useEffect } from 'react'

import { Col, Row } from 'react-bootstrap'
import { connect } from 'react-redux'

import answerSaver from '../answerSaver'
import { Answer, ButtonRow, QuestionCard } from '../QuestionAndOptionsStyle'

function ClosedQuestionPage(props) {
  const answersParent = useRef(null)

  // this array should only have an id
  const [userAnswers, setUserAnswers] = useState([])

  const updateUserAnswers = () => {
   
    const answers= Array.from(answersParent.current.children[0].children)

    const answerInputs = answers.map((answer) => answer.children[0].children[0].children[0]);

    const chosenAnswers = answerInputs.filter((input) => input.checked).map((element) => ({ id: +element.value }));


    setUserAnswers(chosenAnswers)
  }

  const saveAnswer = () => {
    answerSaver(userAnswers, props.question.type, props.expeditionId, props.question.id, props.reloadInfo)
  }

  useEffect(() => { //This effect silently selects first answer for SINGLE_CHOICE questions or otherwise if user doesnt provide any answer, error will pop
    if(props.question.type === "SINGLE_CHOICE"){
        const firstInput = answersParent.current.children[0].children[0].children[0].children[0].children[0];

        setUserAnswers([{id: +firstInput.value}])
    }
  },[answersParent])

  return (
    <>
    <Row
      style={{
        margin: 50,
        marginTop: 0,
        // marginBottom: 100,
        // height: '40%',
        minWidth: "200px", 
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

    <div
        style={{
            margin: 30,
            // border: '2px solid blue',
            display: "flex",
            justifyContent: "center",
        }}
        ref={answersParent}
    >
        <div>
        {props.question.options.map((answer) => (
            
            <Col lg={4} className='py-lg-0 py-3'
            style = {{
                // border: '2px solid red',
                width: "auto",
                minWidth: "400px"
            }}>  
            <Answer
                $background={props.theme.primary}
                $fontColor={props.theme.font}
                key={answer.id}
                className='mx-lg-0 mx-auto'
            >
                <div xxl={1} xs={2} onChange={() => updateUserAnswers()}>
                    <input name='answer' type={props.question.type === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
                        value={answer.id}
                    />        
                </div>

                <div xxl={11} xs={10}>
                {answer.content}
                </div>
            </Answer>
         </Col>
            
        ))}
        </div>        
    </div>
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
