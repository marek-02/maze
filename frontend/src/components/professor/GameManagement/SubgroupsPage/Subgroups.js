import React, { useState,useEffect } from 'react'
import { Button, Row,Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { TeacherRoutes } from '../../../../routes/PageRoutes'
import { isMobileView } from '../../../../utils/mobileHelper'
import { Content } from '../../../App/AppGeneralStyles'
import GoBackButton from '../../../general/GoBackButton/GoBackButton'
import GroupAdditionModal from '../../GroupAdditionPage/GroupAdditionModal'
import { useAppSelector } from '../../../../hooks/hooks'
import GroupService from '../../../../services/group.service'
import {TableContainer,Title} from './SubgroupStyles'
import StudentService from '../../../../services/student.service'


function Subgroups(props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [refreshFunction, setRefreshFunction] = useState(() => {})
  const buttonStyle = { backgroundColor: props.theme.success, borderColor: props.theme.success }

  const isMobileDisplay = isMobileView()

  const courseId = useAppSelector((state) => state.user.courseId)
  const [allGroupIds, setAllGroupIds] = useState([]) //pary (idGrupy,nazwaGrupy)
  const [selectedGroupId, setSelectedGroupId] = useState(-1)
  const [studentsInSubgroups,setStudentsInSubgroups] = useState([]) 
  let [addGroupEffectInvoker,setAddGroupEffectInvoker] = useState(0)

  const addSubgroup = () => {
    setAddGroupEffectInvoker(addGroupEffectInvoker+1);
  }

  useEffect(() => {//dodawanie nowych podgrup
    if(addGroupEffectInvoker==0){
      return;
    } 
    setStudentsInSubgroups(studentsInSubgroups => [...studentsInSubgroups,[]])
    
  },[addGroupEffectInvoker])


  useEffect(() => { //Grabs all groups ids and names
    GroupService.getGroups(courseId)
      .then((response) => {
        let tmp = []
        for(let group of response){
          tmp.push({id: group.id, name: group.name})
        }
        setAllGroupIds(tmp)        
      })
      .catch(() => {
        setAllGroupIds(null)
      })
  }, [])

  useEffect(()=> { //once we got groups we select first of them
    if(allGroupIds.length == 0){
      return
    } 
    setSelectedGroupId(allGroupIds[0].id)         
  },[allGroupIds])

  useEffect(() => { //grabs students from selected group, sets subgroups and puts students in adequate subgroups
    if(selectedGroupId==-1) return;
    GroupService.getGroupStudentsExtended(selectedGroupId)
      .then((response) => {
        const studentsOfGroupArr= response?.map((student) => ({...student}))

        let studentsInSubgroups_local = []
        let maxSubgroup = 0
        for(let student of studentsOfGroupArr){
          if(student.subgroup == null) continue;
          maxSubgroup = Math.max(maxSubgroup, student.subgroup)
        }

        for(let i = 0;i<=maxSubgroup; i++) studentsInSubgroups_local.push([]);
        
        for(let student of studentsOfGroupArr){
          let entry = {id:student.id,firstName: student.firstName, lastName: student.lastName, subgroup:student.subgroup==null?0:student.subgroup}
          if(student.subgroup == null) studentsInSubgroups_local[0].push(entry)
          else studentsInSubgroups_local[student.subgroup].push(entry)
        }

        console.log("StudentsinSubgroups")
        console.log(studentsInSubgroups_local)
        setStudentsInSubgroups(studentsInSubgroups_local)
      })
      .catch(() => {
        setStudentsInSubgroups(null)
      })
  },[selectedGroupId]) 

  function handleOnDrag(event, student){
    event.dataTransfer.setData("student",JSON.stringify(student) )
  }

  function handleOnDrop(event,subgroupId){
    let tmp = []
    const student = JSON.parse(event.dataTransfer.getData("student"))

    for(let i =0; i<studentsInSubgroups.length;i++){
      let arr = studentsInSubgroups[i].slice().filter(item => item.id != student.id)
      if(i == subgroupId){
        student.subgroup = subgroupId        
        arr.push(student)
      } 
      tmp.push(arr)
    }
    
    StudentService.changeStudentSubgroup(student.id,subgroupId,courseId)

    setStudentsInSubgroups(tmp)
  }

  function handleDragOver(event){
    event.preventDefault()
  }

  return (
    <>
      <Content
        className="d-flex flex-column align-items-center h-100"
        style={{ marginBottom: isMobileDisplay ? 85 : 0 }}
      >
        <Row className='m-3'>
          <Title>Podgrupy</Title>
        </Row>
        <Row className='m-3 w-100 px-3' style={{ maxHeight: '80%', overflow: 'auto', maxWidth: '20%' }}>
            <div>Wybierz grupe</div>
            <select id="selectMember" value={selectedGroupId} onChange={(event) => {setSelectedGroupId(event.target.value)}}>
            {
                allGroupIds?.map((groupObj,groupIndex) => <option key={groupIndex} value={groupObj.id}>{groupObj.name}</option>)
            }
          </select>
     
        </Row>

        <Row style={{display:"flex"}}>
            {
                studentsInSubgroups?.map((subgroup,subgroupIndex) =>  {
                  
                  return (
                    <Col>
                    <TableContainer
                      style={{ width: isMobileDisplay ? '200%' : '200px' }}
                      $fontColor={props.theme.font}
                      $background={props.theme.primary}
                      $tdColor={props.theme.secondary}
                    >
                      <thead onDrop = {(e) => {handleOnDrop(e,subgroupIndex)}} onDragOver = {handleDragOver}>
                        <tr>
                          <th className="text-center">{subgroupIndex}</th>
                        </tr>
                      </thead>
                      <tbody className="mh-100" onDrop = {(e) => {handleOnDrop(e,subgroupIndex)}} onDragOver = {handleDragOver}>
                        {
                          subgroup.length>0 && subgroup?.map((student, index) => {
                            return(
                            <tr draggable key={student.id} 
                              onDragStart={(e)=>handleOnDrag(e,student)}>
                              <td className="py-2">
                                {student.firstName} {student.lastName}
                              </td>                              
                            </tr>
                            )
                          })
                        
                      }
                      </tbody>
                    </TableContainer>
                    </Col>
                  )
                })
            }
        </Row>

        <div
          className="d-flex justify-content-center gap-2 position-absolute"
          style={isMobileDisplay ? null : { bottom: 10 }}
        >
          <GoBackButton goTo={TeacherRoutes.GAME_MANAGEMENT.MAIN} customClass="position-relative" />
          <Button 
            style={isMobileDisplay ? { ...buttonStyle } : { ...buttonStyle, position: 'relative' }}
            className="justify-content-end"
            onClick={() => addSubgroup()}
          >
            Dodaj podgrupę
          </Button>
        </div>
      </Content>
      <GroupAdditionModal show={modalOpen} setModalOpen={setModalOpen} refreshFunction={refreshFunction} />
    </>
  )
}

function mapStateToProps(state) {
  const {theme} = state
  return {
    theme
  }
}

export default connect(mapStateToProps)(Subgroups)
