import React, { useState } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import styles from './GradeFileTask.module.scss'
import { useGradeTaskMutation } from '../../../../api/apiGrades'
import { ActivityResponseInfo, GradeTaskRequest } from '../../../../api/types'
import { Activity, getActivityTypeName } from '../../../../utils/constants'
import { ProfessorFileService } from '../../ActivityAssessmentDetails/ProfessorFileService'
import StudentFileService from '../../ActivityAssessmentDetails/StudentFileService'

type GradeFileTaskProps = {
  showDetails: boolean
  onCloseDetails: () => void
  activity: ActivityResponseInfo
}

const GradeFileTask = (props: GradeFileTaskProps) => {
  const [gradeValue, setGradeValue] = useState<string | number>('')
  const [fileBlob, setFileBlob] = useState<Blob | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [remarks, setRemarks] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false) // Nowy stan dla modala błędów

  const fileRef = React.useRef<HTMLInputElement>(null)
  const [gradeTask] = useGradeTaskMutation()

  const prepareRequest = (body: GradeTaskRequest): FormData => {
    const formData = new FormData()
    Object.keys(body).forEach((key) => {
      if (body[key]) {
        formData.append(key, body[key])
      }
    })
    return formData
  }

  const handleSubmit = async () => {
    // Walidacja dla punktów
    if (gradeValue === '' || isNaN(Number(gradeValue))) {
      setErrorMessage('Wartość punktów jest wymagana.')
      setShowErrorModal(true)
      return
    }

    if (typeof gradeValue === 'number' && (gradeValue < 0 || gradeValue > props.activity.maxPoints)) {
      setErrorMessage(
        gradeValue < 0
          ? 'Wartość punktów nie może być ujemna.'
          : `Wynik nie może być większy niż ${props.activity.maxPoints} punktów.`
      )
      setShowErrorModal(true)
      return
    }

    const requestBody = {
      fileTaskResultId: props.activity.fileTaskResponseId,
      content: remarks,
      points: gradeValue === '' ? 0 : gradeValue,
      file: fileBlob,
      fileName
    }

    await gradeTask(prepareRequest(requestBody)).then(() => {
      setRemarks('')
      setGradeValue('')
      setFileName('')
      setFileBlob(null)
      setErrorMessage('')
      setShowErrorModal(false) // Ukryj modal błędu po pomyślnym wysłaniu

      if (fileRef.current) {
        fileRef.current.value = ''
      }
    }).catch((error) => {
      setErrorMessage('Wystąpił błąd podczas oceniania zadania. Spróbuj ponownie.')
      setShowErrorModal(true) // Pokaż modal błędu w przypadku niepowodzenia
    })
  }

  return (
    <>
      {props.activity ? (
        <Modal
          fullscreen
          show={props.showDetails}
          onHide={props.onCloseDetails}
          size='xl'
          className={styles.modalContainer}
          centered
        >
          <Modal.Header className={styles.modalHeader}>
            <Modal.Title className={styles.modalTitle}>{`${getActivityTypeName(Activity.TASK)} - ${
              props.activity.activityName
            }`}</Modal.Title>
            <button
              type='button'
              className={styles.customButtonClose}
              onClick={props.onCloseDetails}
            >
              <span>&times;</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.modalInfoSection}>
              <div>
                <span>Autor: </span>
                {`${props.activity.firstName} ${props.activity.lastName}`}
              </div>
              <span>{props.activity.isLate ? 'Zadanie spóźnione' : 'Zadanie oddane w terminie'}</span>
            </div>
            <div className={styles.modalTaskDescription}>
              <span>Treść zadania:</span>
              <p>{props.activity.activityDetails}</p>
              <span>Odpowiedź:</span>
              <p>{props.activity.userAnswer}</p>
              <StudentFileService activity={props.activity} />
            </div>
            <Form className={styles.formContainer}>
              <Row>
                <Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
                  <Form.Label>
                    <span>Uwagi do zadania</span>
                  </Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    required
                    value={remarks}
                    onChange={(event) => setRemarks(event.target.value)}
                  />
                </Form.Group>
              </Row>
              <Row className={styles.form}>
                <Col xs={3}>
                  <ProfessorFileService setFile={setFileBlob} setFileName={setFileName} fileRef={fileRef} />
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <label htmlFor='grade'>
              <span>Punkty:</span>
              <input
                id='grade'
                name='grade'
                type='number'
                min={0}
                max={props.activity.maxPoints}
                value={gradeValue}
                onChange={(e) => setGradeValue(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              />
              <span>{` / ${props.activity.maxPoints}`}</span>
            </label>
            <Button variant='primary' type='submit' className={styles.gradeButton} onClick={handleSubmit}>
              <span>Oceń</span>
            </Button>
          </Modal.Footer>
        </Modal>
      ) : null}

      {/* Modal błędu */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Błąd</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowErrorModal(false)}>
            Zamknij
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default GradeFileTask
