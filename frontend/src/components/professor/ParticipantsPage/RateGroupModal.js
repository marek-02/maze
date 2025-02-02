import React, { useRef, useState, useCallback } from 'react'
import { Formik } from 'formik'
import {
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Col,
  Button,
  Container,
  Form,
  Spinner,
} from 'react-bootstrap'
import { connect } from 'react-redux'

import { useAppSelector } from '../../../hooks/hooks'
import FormikContext from '../../general/FormikContext/FormikContext'
import { FormCol } from '../../general/LoginAndRegistrationPage/FormCol'
import SuccessModal from '../SuccessModal'
import professorService from '../../../services/professor.service'

function RateGroupModal(props) {
  const { showModal, setShowModal, isLoaded, onSuccess, studentList } = props
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const courseId = useAppSelector((state) => state.user.courseId)
  const formikContextRef = useRef()

  const afterSendAction = useCallback(
    (setSubmitting) => {
      setSubmitting(false)
      setShowModal(false)
      setIsSuccessModalOpen(true)
      setErrorMessage('')
      if (onSuccess) {
        onSuccess()
      }
    },
    [onSuccess, setShowModal]
  )

  const sendAction = async (setSubmitting, values, afterSendAction) => {
    for(const studentId in values) {      
      const studentRoleGrade = values[studentId]["roleGrade"];      
      const studentGroupGrade = values[studentId]["groupGrade"];
      const foundWolfHoles = values[studentId]["wolfHoles"];
      const receivedNominations = values[studentId]["nominations"];
      const role = values[studentId]["role"];

      if(studentRoleGrade == 0 && studentGroupGrade == 0 && foundWolfHoles == 0 && receivedNominations == 0 ) continue; //ungraded students don't get entry   
      try {
          await professorService.sendLaboratoryPoints(studentId, courseId, studentRoleGrade + studentGroupGrade + foundWolfHoles,studentRoleGrade
            ,role, "Spacer", Date.now(),foundWolfHoles,receivedNominations)
      } catch(error) {
          console.log("Error:",error);
          setSubmitting(false)
          setErrorMessage(error)
      }
    }
    afterSendAction(setSubmitting)
  }   

  const initialValues = studentList.sort((a, b) => a.subgroup - b.subgroup).reduce((acc, student) => {
        acc[student.id] = {roleGrade : 0, wolfHoles : 0, nominations : 0, groupGrade : 0, role : student.role};
        return acc;
    }, {});
     
  let previousSubgroup = -1;

  const getFullStudentRoleName = (roleName) => {
    if(roleName === "O")
      return "oboe"
    if(roleName === "S")
      return "scribe"
    if(roleName === "K")
      return "cablemaster"
    return "econom"    
  }

  const getPolishFullStudentRoleName = (roleName) => {
    if(roleName === "O")
      return "Opój"
    if(roleName === "S")
      return "Skryba"
    if(roleName === "K")
      return "Kabelmistrz"
    return "Ekonom"    
  }

  return (
    <>
    <Modal show={showModal} size='lg' onHide={() => setShowModal(false)}>
        <ModalHeader>
        <h4 className='text-center w-100'>Oceń spacer</h4>
        </ModalHeader>
        <ModalBody  className='px-0'>
        <Formik
            initialValues={initialValues}
            onSubmit={(values, { setSubmitting }) => {
                sendAction(setSubmitting, values, afterSendAction)
            }}
        >
            {({ isSubmitting, handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
                <FormikContext ref={formikContextRef} />
                <Container>
                {
                    studentList.sort((a, b) => a.subgroup - b.subgroup).map((student, index) => {
                        const isDifferentSubgroup = previousSubgroup !== student.subgroup;
                        previousSubgroup = student.subgroup;
                        
                        return (
                        <Row className='mx-auto d-flex align-items-center'>
                            <div className='m-2' className={isDifferentSubgroup && index !== 0 ? 'border border-dark' : '' }/>
                            <Col md={2}>
                            <h6>{student.firstName} {student.lastName} </h6>
                            </Col>
                            <Col md={2}>
                            <h6><b>{getPolishFullStudentRoleName(student.role)}</b></h6>
                            </Col>
                            {FormCol('Ocena Rola', 'number', student.id + '.' + 'roleGrade', 2, { min: 0, errorColor: props.theme.danger })}
                            {FormCol('Ocena Grupa', 'number', student.id + '.' + 'groupGrade', 2, { min: 0, errorColor: props.theme.danger })}
                            {/* <Col md={1}></Col> */}
                            {FormCol('Wilcze doły', 'number', student.id + '.' + 'wolfHoles', 2,{ min: 0, errorColor: props.theme.danger })}
                            {FormCol('Nominacje', 'number', student.id + '.' + 'nominations', 1,{ min: 0, errorColor: props.theme.danger })}
                        </Row>
                    )})
                }

                <Row className='mt-4 d-flex justify-content-center'>
                    <Col sm={12} className='d-flex justify-content-center mb-2'>
                    <Button
                        style={{ backgroundColor: props.theme.danger, borderColor: props.theme.danger }}
                        className='me-2'
                        onClick={() => setShowModal(false)}
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
                        {isSubmitting ? (
                        <Spinner as='span' animation='border' size='sm' role='status' />
                        ) : (
                        <span>Zapisz oceny</span>
                        )}
                    </Button>
                    </Col>
                </Row>
                </Container>
            </Form>
            )}
        </Formik>
        {errorMessage && (
            <p className='text-center mt-2' style={{ color: props.theme.danger }}>
            {errorMessage}
            </p>
        )}
        </ModalBody>
    </Modal>
    <SuccessModal
        isSuccessModalOpen={isSuccessModalOpen}
        setIsSuccessModalOpen={setIsSuccessModalOpen}
        text={'Udało się zapisać oceny'}
    />      
    </>
  )
}

function mapStateToProps(state) {
  const { theme } = state

  return { theme }
}

export default connect(mapStateToProps)(RateGroupModal)
