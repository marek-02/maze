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
import {ScribeImg,SoakImg,EconomistImg,CableMasterImg} from '../../../../utils/constants'


function Subgroups(props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [refreshFunction, setRefreshFunction] = useState(() => {})
  const buttonStyle = { backgroundColor: props.theme.success, borderColor: props.theme.success }

  const isMobileDisplay = isMobileView()

  const courseId = useAppSelector((state) => state.user.courseId)
  const [allGroupIds, setAllGroupIds] = useState([]) //pary (idGrupy,nazwaGrupy)
  const [selectedGroupId, setSelectedGroupId] = useState(-1)
  const [studentsInSubgroups,setStudentsInSubgroups] = useState([]) 
  const [addGroupEffectInvoker,setAddGroupEffectInvoker] = useState(0)

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
          let entry = {id:student.id,firstName: student.firstName, lastName: student.lastName,
             subgroup:student.subgroup==null?0:student.subgroup, role:student.role}
          if(student.subgroup == null) studentsInSubgroups_local[0].push(entry)
          else studentsInSubgroups_local[student.subgroup].push(entry)
        }

        setStudentsInSubgroups(studentsInSubgroups_local)
      })
      .catch(() => {
        setStudentsInSubgroups(null)
      })
  },[selectedGroupId]) 

  function handleOnDrag(event, student){
    event.dataTransfer.setData("student",JSON.stringify(student) )
  }
  function handleOnDragImg(event,roleKey){
    event.dataTransfer.setData("role",roleKey);
  }

  function handleOnDrop(event,subgroupId){
    let tmp = []
    if(event.dataTransfer.getData("student")===""){ //img was dragged instead of student, the other fired event will handle it
      return;
    }

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

  function handleOnDropImg(event,indices){
    let role = event.dataTransfer.getData("role")
    if(role===""){ //student was dropped instead of img, we call the other onDrop func
      return;
    }

    const [subgroupIdx,studentIdx] = indices.split(" ");
    const student = studentsInSubgroups[subgroupIdx][studentIdx];    
    student.role = role

    let tmp = []
    for(let i =0; i<studentsInSubgroups.length;i++){
      let arr = studentsInSubgroups[i].slice()
      if(i == subgroupIdx){
        student.subgroup = subgroupIdx    
      } 
      tmp.push(arr)
    }

    StudentService.changeStudentRole(student.id,role,courseId);
    setStudentsInSubgroups(tmp)
  }

  function handleDragOver(event){
    event.preventDefault()
  }

  function getClassImgSrcById(id){
    switch(id){
      case "S": return ScribeImg
      case "E": return EconomistImg
      case "O": return SoakImg
      case "K": return CableMasterImg
      case "": return null;
    }
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
                          <th>Role</th>
                        </tr>
                      </thead>
                      
                      <tbody className="mh-100" onDrop = {(e) => {handleOnDrop(e,subgroupIndex)}} onDragOver = {handleDragOver}>
                        {
                          subgroup.length>0 && subgroup?.map((student, index) => {
                            return(
                            <tr draggable key={student.id} 
                              onDragStart={(e)=>handleOnDrag(e,student)} onDrop = {(e) => {handleOnDropImg(e,subgroupIndex+" "+index)}} onDragOver = {handleDragOver}>
                              <td className="py-2">
                                {student.firstName} {student.lastName}
                              </td>            
                              <td>
                                <img style={{ maxWidth: '50px' }} src={getClassImgSrcById(student.role)} alt='Brak roli'/>
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
              <TableContainer
              style={{ width: isMobileDisplay ? '200%' : '100px' ,marginLeft:"100px"}}
              $fontColor={props.theme.font}
              $background={props.theme.primary}
              $tdColor={props.theme.secondary}>
              <thead>
                <tr>
                  <th className="text-center">Role</th>
                </tr>
              </thead>
              <tbody onDrop = {(e) => {e=1}} onDragOver = {handleDragOver}> {/*This onDrop is useless but it doesnt work without onDrop prop*/}
                <tr draggable key={'E'.charCodeAt(0)} onDragStart={(e)=>handleOnDragImg(e,'E')}>
                  <td><img style={{ maxWidth: '100px' }} src={EconomistImg} alt='Econom img'/></td>
                </tr>
  
                <tr draggable key={'K'.charCodeAt(0)} onDragStart={(e)=>handleOnDragImg(e,'K')}>
                  <td><img style={{ maxWidth: '100px' }} src={CableMasterImg} alt='Cable img'/></td>
                </tr>
  
                <tr draggable key={'S'.charCodeAt(0)} onDragStart={(e)=>handleOnDragImg(e,'S')}>
                  <td><img style={{ maxWidth: '100px' }} src={ScribeImg} alt='Scribe img'/></td>
                </tr>
  
                <tr draggable key={'O'.charCodeAt(0)} onDragStart={(e)=>handleOnDragImg(e,'O')}>
                  <td><img style={{ maxWidth: '100px' }} src={SoakImg} alt='Soak img'/></td>
                </tr>
              </tbody>
              
              </TableContainer>         
            
          
            
            
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
