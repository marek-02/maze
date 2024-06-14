import React, { useState } from 'react'

import { Formik } from 'formik'
import { Button, Col, Container, Form, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'react-bootstrap'
import { connect } from 'react-redux'

import ProfessorService from '../../../services/professor.service'
import { FIELD_REQUIRED, NUMBER_FROM_RANGE } from '../../../utils/constants'
import { FormCol } from '../../general/LoginAndRegistrationPage/FormCol'
import { useAppSelector } from '../../../hooks/hooks'
import { GridCol } from '../../general/LoginAndRegistrationPage/GridCol'


function AssignPointsModal(props) {
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false)
  const [finishModalDescription, setFinishModalDescription] = useState(undefined)
  const courseId = useAppSelector((state) => state.user.courseId)
  const [annihilatedQuestions,setAnnihilatedQuestions] = useState(0)
  const [annihilatedPoints,setAnnihilatedPoints] = useState(0)

  function parseFloatWithPrecision(value) {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      return NaN;  // Handle non-numeric input
    }
    return parsedValue.toFixed(2);
  }

  const handleGridColUpdate = (annihilatedQuestions, annihilatedPoints) => {
    setAnnihilatedPoints(annihilatedPoints)
    setAnnihilatedQuestions(annihilatedQuestions)
  };

  return (
    <>
      <Modal show={props.show} onHide={() => props.setModalOpen(false)} size="lg">
        <ModalHeader>
          <h4 className="text-center w-100">Przyznaj punkty</h4>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              reason: 'Praca na zajęciach',
              points: '',
              activityType: '',
              role: '',
            }}
            validate={(values) => {
              const errors = {}
              if (!values.points) errors.points = FIELD_REQUIRED
              if (values.points === 0) errors.points = NUMBER_FROM_RANGE(1, 100)
              if (!values.activityType) errors.activityType = FIELD_REQUIRED
              if (values.annihilatedPoints === 0) errors.points = NUMBER_FROM_RANGE(1, 72)
              return errors
            }}
            onSubmit={(values, { setSubmitting }) => {
              const { activityType, points, reason, role } = values;
              const studentId = props?.studentId;
              const parsedPoints = parseFloatWithPrecision(points);
              const timestamp = Date.now();
            
              let serviceMethod;
              let methodArgs = [studentId, courseId, parsedPoints, reason, timestamp];

              if (activityType.includes('colloquium')) {
                const colloquiumId = activityType.charAt(activityType.length - 1);
                serviceMethod = ProfessorService.sendColloquiumPoints;
                methodArgs.splice(4, 0, parseInt(colloquiumId), 0, 0);
              } else if (activityType === 'laboratory_points') {
                serviceMethod = ProfessorService.sendLaboratoryPoints;
                methodArgs.splice(4, 0, role);
              } else {
                serviceMethod = ProfessorService.sendBonusPoints;
              }
            
              serviceMethod(...methodArgs)
                .then(() => {
                  setFinishModalDescription('Proces przyznawania punktów zakończył się pomyślnie.')
                })
                .catch((error) => {
                  setFinishModalDescription(`Napotkano pewne problemy. Punkty nie zostały przyznane. <br/> ${error}`)
                });
            
              props.setModalOpen(false);
              setIsFinishModalOpen(true);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, handleSubmit,values }) => (
              <Form onSubmit={handleSubmit}>
                <Container>
                  <Row className='mx-auto'>
                    {FormCol('Informacja zwrotna (opcjonalnie)', 'textarea', 'reason', 12, {
                      errorColor: props.theme.danger
                    })}
                    {!values.activityType.includes('colloquium') && FormCol('Punkty', 'number', 'points', 12, { errorColor: props.theme.danger })}
                    {FormCol('Typ aktywności', 'dropdown', 'activityType', 12, { errorColor: props.theme.danger })}
                    {values.activityType.includes('colloquium') && <GridCol name={"Ocenianie kolokwium"} colName={'annihilatedPoints'} onUpdate={handleGridColUpdate}/>}
                    {values.activityType === 'laboratory_points' && FormCol('Rola', 'dropdown', 'role', 12, { errorColor: props.theme.danger })}
                  </Row>
                  <Row className='mt-4 d-flex justify-content-center'>
                    <Col sm={12} className='d-flex justify-content-center mb-2'>
                      <Button
                        className="me-2"
                        style={{
                          backgroundColor: props.theme.danger,
                          borderColor: props.theme.danger
                        }}
                        onClick={() => props.setModalOpen(false)}
                      >
                        Anuluj
                      </Button>
                      <Button
                        type='submit'
                        disabled={isSubmitting}
                        style={{
                          backgroundColor: props.theme.success,
                          borderColor: props.theme.success
                        }}
                      >
                        Przyznaj punkty
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
      <Modal show={isFinishModalOpen} onHide={() => setFinishModalDescription(false)}>
        <ModalHeader>
          <h4 className="text-center">Zakończono proces.</h4>
        </ModalHeader>
        <ModalBody>
          <p>{finishModalDescription}</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setIsFinishModalOpen(false)}>Zakończ</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

function mapStateToProps(state) {
  const {theme} = state
  return {
    theme
  }
}
export default connect(mapStateToProps)(AssignPointsModal)
