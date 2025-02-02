import React, { useEffect, useState } from 'react'

import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'

import AssignPointsModal from './AssignPointsModal'
import ChangeGroupModal from './ChangeGroupModal'
import { TableContainer } from './ParticipantsStyles'
import { useAppSelector } from '../../../hooks/hooks'
import GroupService from '../../../services/group.service'
import { ERROR_OCCURRED } from '../../../utils/constants'
import { isMobileView } from '../../../utils/mobileHelper'
import { GameCardOptionPick } from '../../general/GameCardStyles'
import GameButton from '../GameManagement/GameButton'
import RateGroupModal from './RateGroupModal'

function ParticipantsTable(props) {
  const isMobileDisplay = isMobileView()

  const [changeGroupModalOpen, setChangeGroupModalOpen] = useState(false)
  const [assignPointsModalOpen, setAssignPointsModalOpen] = useState(false)
  const [chosenStudent, setChosenStudent] = useState()
  const [studentsList, setStudentsList] = useState([])
  
  const [showRateGroupModal, setShowRateGroupModal] = useState(false)
  const [shouldLoadRateGroupModal, setShouldLoadRateGroupModal] = useState(false)

  const courseId = useAppSelector((state) => state.user.courseId)

  let previousSubgroup = -1;
  // "if (!modalOpen)" is here because this useEffect is triggered
  // when we have finished group change process and closed this modal
  useEffect(() => {
    if (!changeGroupModalOpen) {
      if (!props.groupId || !props.groupName) {
        GroupService.getAllStudents(courseId)
          .then((response) => setStudentsList([...response]))
          .catch(() => {
            setStudentsList(null)
          })
      } else {
        GroupService.getGroupStudentsExtended(props.groupId)
          .then((response) => {
            const responseWithGroupName = response?.map((student) => ({ ...student, groupName: props.groupName }))
            setStudentsList(responseWithGroupName)
          })
          .catch(() => {
            setStudentsList(null)
          })
      }
    }
  }, [props, changeGroupModalOpen])
  
  return (
    <GameCardOptionPick style={{ maxHeight: '91vh', overflowY: 'auto', marginBottom: isMobileDisplay ? 85 : 'auto' }}>
      {
        props.groupId && props.groupName ? 
        <GameButton
          text='Oceń spacer'
          customWidth='auto'
          callback={() => {
            setShowRateGroupModal(true)
            setShouldLoadRateGroupModal(true)
          }}
        /> : ""
      }
      <TableContainer
        style={{ width: isMobileDisplay ? '200%' : '100%' }}
        $fontColor={props.theme.font}
        $background={props.theme.primary}
        $tdColor={props.theme.secondary}
      >
        <thead>
          <tr>
            <th>Nazwa grupy</th>
            <th>Imię i nazwisko członka</th>
            <th className="text-center">Akcje</th>
          </tr>
        </thead>
        <tbody className="mh-100">
          {studentsList?.length > 0 ? (
            studentsList.sort((a, b) => a.subgroup - b.subgroup).map((student, index) => {
              const isDifferentSubgroup = previousSubgroup !== student.subgroup;
              previousSubgroup = student.subgroup;

              return (
              <>
              {isDifferentSubgroup && index !== 0 && (
                <tr style={{borderTop: "4px solid " + props.theme.primary}}></tr>
              )}
              <tr key={index + student.groupName}>
                <td className="py-2">{student.groupName}</td>
                <td className="py-2">
                  {student.firstName} {student.lastName}
                </td>
                <td className="py-2 text-center">
                  <Button
                    style={{ backgroundColor: props.theme.success, border: 'none' }}
                    onClick={() => {
                      setChosenStudent(student)
                      setChangeGroupModalOpen(true)
                    }}
                  >
                    Zmień grupę
                  </Button>
                  <Button
                    className="ms-2"
                    style={{ backgroundColor: props.theme.success, border: 'none' }}
                    onClick={() => {
                      setChosenStudent(student)
                      setAssignPointsModalOpen(true)
                    }}
                  >
                    Przyznaj punkty
                  </Button>
                </td>
              </tr>
              </>
            )})
          ) : (
            <tr>
              <td colSpan='100%' className="text-center">
                <p>{studentsList == null ? ERROR_OCCURRED : 'Brak członków'}</p>
              </td>
            </tr>
          )}
        </tbody>
      </TableContainer>
      <ChangeGroupModal show={changeGroupModalOpen} setModalOpen={setChangeGroupModalOpen} student={chosenStudent} />
      <AssignPointsModal
        show={assignPointsModalOpen}
        setModalOpen={setAssignPointsModalOpen}
        studentId={chosenStudent?.id}
      />
      <RateGroupModal
        showModal={showRateGroupModal}
        setShowModal={setShowRateGroupModal}
        onSuccess={null}
        isLoaded={shouldLoadRateGroupModal}
        studentList={studentsList}
      />
    </GameCardOptionPick>
  )
}

function mapStateToProps(state) {
  const {theme} = state
  return {
    theme
  }
}
export default connect(mapStateToProps)(ParticipantsTable)
