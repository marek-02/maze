import React, { useEffect, useState } from 'react'

import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import { connect } from 'react-redux'
import { useAppSelector } from '../../../hooks/hooks'
import ProfessorService from '../../../services/professor.service'
import LastPointsTable from '../../student/PointsPage/Tables/LastPointsTable'

function StudentPointsModal(props) {
  const [studentPoints, setStudentPoints] = useState(undefined)
  const courseId = useAppSelector((state) => state.user.courseId);

  useEffect(() => {
    if (props.show) {
      ProfessorService.getStudentPointsList(courseId,props.studentEmail)
        .then((response) => {
          setStudentPoints(response)
        })
        .catch(() => {
          setStudentPoints(null)
        })
    }
  }, [props])

  return (
    <Modal show={props.show} onHide={() => props.setModalOpen(false)} size="xl">
      <ModalHeader>
        <h4>Tabela punktów studenta</h4>
      </ModalHeader>
      <ModalBody style={{ overflow: 'auto', padding: '0', margin: '10px' }}>
        <LastPointsTable pointsList={studentPoints} />
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => props.setModalOpen(false)}
          style={{ backgroundColor: props.theme.success, borderColor: props.theme.success }}
        >
          Zamknij
        </Button>
      </ModalFooter>
    </Modal>
  )
}

function mapStateToProps(state) {
  const {theme} = state

  return { theme }
}
export default connect(mapStateToProps)(StudentPointsModal)
