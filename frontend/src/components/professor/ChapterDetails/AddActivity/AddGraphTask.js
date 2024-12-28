import React, { useEffect, useRef, useState } from 'react'

import { faRefresh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Tab, Tabs } from 'react-bootstrap'
import { connect } from 'react-redux'

import FileUpload from './FileUpload'
import ExpeditionService from '../../../../services/expedition.service'
import { Activity, ERROR_OCCURRED } from '../../../../utils/constants'
import Graph from '../../../general/Graph/Graph'
import { getGraphElements, getNodeColor } from '../../../general/Graph/graphHelper'
import JSONEditor from '../../../general/jsonEditor/JSONEditor'
import Loader from '../../../general/Loader/Loader'
import { Modal, Form } from 'react-bootstrap';
import { faArrowDown, faArrowUp, faPaperclip, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'

function AddGraphTask(props) {
    const [placeholderJson, setPlaceholderJson] = useState(undefined)
    const [errorMessage, setErrorMessage] = useState('')
    const [graphElements, setGraphElements] = useState(null)


    const [questions, setQuestions] = useState([]); //all questions
    const [showModal,setShowModal] = useState(false);

    const [newQuestionContent,setNewQuestionContent] = useState(""); //question visible in modal
    const [answers, setAnswers] = useState([{ content: "", isCorrect: false }]); //answers for newQuestion (answers visible in modal)
    const [newQuestionPoints, setNewQuestionPoints] = useState(5);
    const [newQuestionType, setNewQuestionType] = useState("MULTIPLE_CHOICE");

    const [editingQuestionId,setEditingQuestionId] = useState(null); //if this is not null, ,,Zatwierdź" button in modal adds new question instead of editing

    const [title,setTitle] = useState("");
    const [topic,setTopic] = useState("");
    const [description,setDescription] = useState("");
    const [posX,setPosX] = useState(0);
    const [posY,setPosY] = useState(0);
    const [timeToSolve,setTimeToSolve] = useState("00:30:00");

    // useEffect(() => {
    // ExpeditionService.getGraphTaskJson()
    //     .then((response) => {
    //     setPlaceholderJson(response)
    //     })
    //     .catch((error) => {
    //     setPlaceholderJson(null)
    //     setErrorMessage(error.response.data.message ?? ERROR_OCCURRED)
    //     })
    // }, [])

    useEffect(() => {
        ExpeditionService.getGraphTaskJson()
        .then((response) => {
            setPlaceholderJson(response);
            const placeholderJsonLoc = response;            
            
            setTitle(placeholderJsonLoc.title);
            setTopic(placeholderJsonLoc.taskContent);
            setDescription(placeholderJsonLoc.description);
            setPosX(placeholderJsonLoc.posX);
            setPosY(placeholderJsonLoc.posY);
            setTimeToSolve(placeholderJsonLoc.timeToSolve);

            const filteredQuestions = placeholderJsonLoc.questions.filter((question,index) => index > 0);
            // console.log("Filtered:",filteredQuestions);
            // console.log("questions:",questions);
            setQuestions(filteredQuestions.map((question,index) => ({
                content: question.content,
                answers: question?.answers ? question?.answers.map((answer) => ({ content: answer.content, isCorrect: answer.isCorrect})) : [{ content: "", isCorrect: false }],
                questionType: question.questionType,
                points: question.points,
                }
            ))); //to remove null
        })
        .catch((error) => {
            // setPlaceholderJson(null)
            setErrorMessage(error.response?.data.message ?? ERROR_OCCURRED)
        })        
    },[])

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    const addQuestion = () => {
        setQuestions([...questions, { content: newQuestionContent,answers: answers, questionType: newQuestionType, points: newQuestionPoints }]);
        setNewQuestionContent("");
        setAnswers([{ content: "", isCorrect: false }]);
        // setNewQuestionPoints(5)
        // handleUpdatePlaceholderJson();
        handleModalClose();
    };

    const removeQuestion = (index) => { 
        setQuestions(questions.filter((_, i) => i !== index));

        // handleUpdatePlaceholderJson();
    };

    const addAnswer = () => { 
        setAnswers([...answers, { content: "", isCorrect: false }]);
    };

    const removeAnswer = (index) => {
        setAnswers(answers.filter((_,i) => i !== index));
    }

    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = answers.map((answer, i) =>
            i === index ? { ...answer, [field]: value } : answer
        );
        setAnswers(updatedAnswers);
    };

    const handleEditQuestion = (index) => { //Clicked on pencil
        // console.log("questions:",questions);
        setAnswers([...questions[index].answers]);
        setNewQuestionContent(questions[index].content);
        setNewQuestionPoints(questions[index].points)
        setNewQuestionType(questions[index].questionType);
        setEditingQuestionId(index);
        handleModalShow();
    }

    const handleModalConfirmClicked = () => {
        // console.log("Id:",editingQuestionId)
        if(editingQuestionId === null) addQuestion();
        else{            
            // setAnswers(answers.map((answer,i) => i === editingQuestionId ? { content: newQuestion,answers: answers } : answer));
            setQuestions(questions.map((question,i) => i === editingQuestionId ? { content: newQuestionContent,answers: answers, questionType: newQuestionType, points: newQuestionPoints  } : question))
            setNewQuestionContent("");
            setAnswers([{ content: "", isCorrect: false }]);
            setEditingQuestionId(null);
            // handleUpdatePlaceholderJson();
            handleModalClose();
        } 
    }

    const writeAndSendJson = () => {
        const numQuestions = questions.length;
        let newJson = {
            activityType: "EXPEDITION",
            title: title,
            taskContent: topic,   
            description: description,                     
            posX: posX,
            posY: posY,
            timeToSolve: timeToSolve,
            questions: questions.map((question,index) => ({
                questionNum: index+1,
                difficulty: "EASY",
                hint: "",
                points: question.points,
                content: question.content,
                answers: question?.answers,
                nextQuestions : index === numQuestions - 1 ? [] : [index+2],
                questionType: question.questionType
            }))
        }
        const startQuestion = { //for some reason system requires first question, which is then not shown for students
            questionNum:0,
            nextQuestions: [1],
            difficulty: "EASY",
            points: 0,
            content: "",
            answers: [{ content: "fake", isCorrect: false }, { content: "fake", isCorrect: true}],
            nextQuestions : [1],
            questionType: "SINGLE_CHOICE"
        }
        newJson.questions = [startQuestion ,...newJson.questions];
        // console.log("Seting json to:",newJson);
        setPlaceholderJson(newJson);

        ExpeditionService.setGraphTaskJson(props.chapterId, newJson)
        .then(() => {
            props.onSuccess()
        })
        .catch((error) => {
            setErrorMessage(error.response?.data?.message ?? ERROR_OCCURRED)
        })
    }

    return (
        <>
        <Tabs defaultActiveKey="editor">
            <Tab eventKey="editor" title="Tryb edycji">
            {placeholderJson === undefined ? (
                <Loader />
            ) : placeholderJson == null ? (
                <p>{errorMessage}</p>
            ) : (
                <div style={{marginTop: "50px", overflowY: 'auto', maxHeight: "600px"}}>
                <h3>Edytor Niespodzianek</h3>

                <Form.Group className="mb-3">
                        <Form.Label>Tytuł Niespodzianki</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Pierwsza niespodzianka"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        />
                </Form.Group>
                <Form.Group className="mb-3">
                        <Form.Label>Temat niespodzianki</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Model OSI, funkcje warstwy II oraz zasady przełączania."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        />
                </Form.Group>
                <Form.Group className="mb-3">
                        <Form.Label>Dodatkowy opis</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Zapraszam chętnych..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        />
                </Form.Group>
                <Form.Group className="mb-3">
                        <Form.Label>PosX</Form.Label>
                        <Form.Control
                        type="number"
                        placeholder="0"
                        value={posX}
                        onChange={(e) => setPosX(parseInt( e.target.value ))}
                        />
                </Form.Group>
                <Form.Group className="mb-3">
                        <Form.Label>PosY</Form.Label>
                        <Form.Control
                        type="number"
                        placeholder="0"
                        value={posY}
                        onChange={(e) => setPosY(parseInt(e.target.value))}
                        />
                </Form.Group>
                <Form.Group className="mb-3">
                        <Form.Label>Czas na rozwiązanie</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="00:30:00"
                        value={timeToSolve}
                        onChange={(e) => setTimeToSolve(e.target.value)}
                        />
                </Form.Group>

                {questions.map((question, index) => (
                    <div key={index} className="mb-3 p-3 border">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>Pytanie: {index + 1}</h5>                
                        <div>
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            // size='lg'
                            style={{ cursor: "pointer", marginRight: "25px" }}
                            onClick={(e) => {handleEditQuestion(index)}}
                        />
                        <FontAwesomeIcon
                            icon={faTrash}
                            // size='lg'
                            className="text-danger"
                            style={{ cursor: "pointer", marginRight: "15px" }}
                            onClick={() => removeQuestion(index)}
                        />
                        </div>
                    </div>
                    <p>Treść: {question.content}</p>
                    <p>Wybór: {question.questionType === "SINGLE_CHOICE" ? "Jednokrotny" : "Wielokrotny"}</p>
                    <p>Punkty: {question.points}</p>
                    <br/>
                    <p>Odpowiedzi:</p>
                    <ul>
                        {question?.answers.map((answer, i) => (
                        <li key={i}>
                            {answer.content} - {answer.isCorrect ? "Poprawna" : "Niepoprawna"}
                        </li>
                        ))}
                    </ul>
                    </div>
                ))}
                <Button variant="primary" onClick={handleModalShow}>
                    Dodaj pytanie
                </Button>
            
                {/* Modal for adding a new question */}
                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Edycja pytania</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Treść</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Wprowadź pytanie tutaj"
                        value={newQuestionContent}
                        onChange={(e) => setNewQuestionContent(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Punkty</Form.Label>
                        <Form.Control
                        type="number"
                        placeholder="5"
                        value={newQuestionPoints}
                        onChange={(e) => setNewQuestionPoints(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Typ wyboru</Form.Label>
                        <Form.Check
                            type = "radio"
                            label = "Jednokrotny"
                            name="type"
                            value="SINGLE_CHOICE"
                            checked={newQuestionType === "SINGLE_CHOICE"}
                            onChange={(e) => setNewQuestionType(e.target.value)}
                        />
                        <Form.Check
                            type = "radio"
                            label = "Wielokrotny"
                            name="type"
                            value="MULTIPLE_CHOICE"
                            checked={newQuestionType === "MULTIPLE_CHOICE"}
                            onChange={(e) => setNewQuestionType(e.target.value)}
                        />
                    </Form.Group>

                    {answers.map((answer, index) => (
                        <div key={index} className="d-flex align-items-center mb-2">
                            <FontAwesomeIcon
                            icon={faTrash}
                            // size='lg'
                            className="text-danger"
                            style={{ cursor: "pointer", marginRight: "15px" }}
                            onClick={() => removeAnswer(index)}
                            />
                        <Form.Control
                            type="text"
                            placeholder="Tekst odpowiedzi"
                            value={answer.content}
                            onChange={(e) => handleAnswerChange(index, "content", e.target.value)}
                            className="me-2"
                        />                   
                        <Form.Check
                            type="checkbox"
                            label="Poprawna"
                            checked={answer.isCorrect}
                            onChange={(e) => handleAnswerChange(index, "isCorrect", e.target.checked)}
                        />
                        </div>
                    ))}
                    <Button variant="secondary" onClick={addAnswer}>
                        Dodaj nową odpowiedź
                    </Button>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Anuluj
                    </Button>
                    <Button variant="primary" onClick={handleModalConfirmClicked}>
                        Zatwierdź
                    </Button>
                    </Modal.Footer>
                </Modal>
                </div>    
            )}
            
            </Tab>
        </Tabs>

        {placeholderJson && (
            <div className="d-flex flex-column justify-content-center align-items-center pt-4 gap-2">
            {errorMessage && (
                <p style={{ color: props.theme.danger }} className="h6">
                {errorMessage}
                </p>
            )}
            <div className="d-flex gap-2">
                <Button
                style={{ backgroundColor: props.theme.danger, borderColor: props.theme.danger }}
                onClick={props.onCancel}
                >
                Anuluj
                </Button>
                <Button
                style={{ backgroundColor: props.theme.success, borderColor: props.theme.success }}
                onClick={() => writeAndSendJson()}
                >
                Dodaj aktywność
                </Button>
            </div>
            </div>
        )}
        </>
    )
    }

    function mapStateToProps(state) {
        const {theme} = state

        return { theme }
    }
    export default connect(mapStateToProps)(AddGraphTask)
