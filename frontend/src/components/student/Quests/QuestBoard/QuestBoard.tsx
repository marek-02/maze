import React, { useCallback, useEffect, useState } from 'react'

import { Row, Stack } from 'react-bootstrap'

import style from './QuestBoard.module.scss'
import { ActivityMapResponse } from '../../../../api/types'
import { useAppSelector } from '../../../../hooks/hooks'
import ActivityService from '../../../../services/activity.service'
import QuestCard from '../QuestCard/QuestCard'
import GroupService from '../../../../services/group.service'
import {TableContainer,Title} from '../../../professor/GameManagement/SubgroupsPage/SubgroupStyles' //pozniej to mozna poprawic :)
import { isMobileView } from '../../../../utils/mobileHelper'
import {ScribeImg,SoakImg,EconomistImg,CableMasterImg} from '../../../../utils/constants'
import StudentService from '../../../../services/student.service'
import authService from '../../../../services/auth.service'
import userService from '../../../../services/user.service'

const emptyMapResponse: ActivityMapResponse = {
  id: 0,
  tasks: [],
  mapSizeX: 0,
  mapSizeY: 0,
  image: null
}

const QuestBoard = () => {
  const [activities, setActivities] = useState<ActivityMapResponse>(emptyMapResponse)

  const selectedChapterId = useAppSelector((state) => state.user.selectedChapterId)

  const courseId = useAppSelector((state) => state.user.courseId)
  const [studentsOfSubgroup,setStudentsOfSubgroup] = useState<any>([]);
  const isMobileDisplay = isMobileView()

  useEffect(() => {
    getActivities()
  }, [selectedChapterId])

  const getActivities = useCallback(() => {
    ActivityService.getActivityMap(selectedChapterId)
      .then((response) => {
        setActivities(response)
      })
      .catch(() => {
        setActivities(emptyMapResponse)
      })
  }, [selectedChapterId])

  useEffect(() => { //grabs students from this students subgroup
    let userGroup =-1;
    let userSubgroup = -1;
    userService.getUserGroupId(courseId)
    .then((response) => {
        userGroup = response;

        userService.getUserSubgroupId(courseId)
        .then((response) => {
            userSubgroup = response;

            GroupService.getSubgroupStudentsExtended(userGroup, userSubgroup)
            .then((response) => {
                const studentsOfSubgroupResponse= response?.map((student : any) => ({...student}))
                let studentsOfSubgroup_local = []        
                let count = 0;
                for(let student of studentsOfSubgroupResponse){
                    if(count == 4) break;
                    let entry = {id:student.id,firstName: student.firstName, lastName: student.lastName,
                        subgroup:student.subgroup==null?0:student.subgroup, role:student.role}
                    
                    studentsOfSubgroup_local.push(entry);
                    count++;
                }
                setStudentsOfSubgroup(studentsOfSubgroup_local);

            })
            .catch(() => {
                setStudentsOfSubgroup(null)
            })
        })    
    })
    .catch(() => {
        // console.log("Nie udalo sie pobrac grupy")
    })    
  },[]) 

  function handleOnDragImg(event : any,roleKey : string){
    event.dataTransfer.setData("role",roleKey);
  }


  function handleOnDrop(event :any,index : number){
    let role = event.dataTransfer.getData("role")
    if(role===""){ //student was dropped instead of img, we call the other onDrop func
      return;
    }

    // const [subgroupIdx,studentIdx] = indices.split(" ");
    const student = studentsOfSubgroup[index];    
    student.role = role

    let tmp = studentsOfSubgroup.slice();
    tmp[index] = student;


    StudentService.changeStudentRole(student.id,role,courseId);
    setStudentsOfSubgroup(tmp)
  }

  function handleDragOver(event :any){
    event.preventDefault()
  }

  function getClassImgSrcById(id : string){
    switch(id){
      case "S": return ScribeImg
      case "E": return EconomistImg
      case "O": return SoakImg
      case "K": return CableMasterImg
      case "": return null;
    }
  }


  return (
    <div style={{ height: '100%', position: 'relative'}}>
        <Row style = {{height: "20%", width:'100%'}}>                  
            <div style={{display: 'flex', justifyContent:'center',  alignItems: 'center'}}>
                <div style={{marginRight: '100px'}}>
                    <div style={{display: "flex", justifyContent:'center'}}>
                        {
                            studentsOfSubgroup.length>0 && studentsOfSubgroup?.map((student :any, index:number) => {
                                return(
                                    <div onDrop = {(e) => {handleOnDrop(e,index)}} onDragOver = {handleDragOver}
                                         style={{width: '100px', height:'80px', border:"1px solid white", textAlign:'center', display:'flex', alignItems:'center', justifyContent:"center"}}>
                                        <img style={{ maxWidth: '80px' }} src={getClassImgSrcById(student.role)} alt='Brak roli'/>
                                    </div>
                                )
                            })
                        }                    
                    </div>
                    <div style={{display: "flex", justifyContent:'center'}}>
                        {
                            studentsOfSubgroup.length>0 && studentsOfSubgroup?.map((student :any, index:number) => {
                                return(
                                    <div style={{width: '100px', height:'80px', border:"1px solid white", textAlign:'center', display:'flex', alignItems:'center', wordBreak:"break-word"}}>
                                        {student.firstName} {student.lastName}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div style={{display: "flex"}} onDrop = {(e) => {}} onDragOver = {handleDragOver}>
                    <div style={{border: '1px solid white', marginRight: '10px'}} draggable key={'E'.charCodeAt(0)} onDragStart={(e)=>handleOnDragImg(e,'E')}>
                        <img style={{ maxWidth: '80px' }} src={EconomistImg} alt='Econom img'/>
                    </div>
                    
                    <div style={{border: '1px solid white', marginRight: '10px'}} draggable key={'S'.charCodeAt(0)} onDragStart={(e)=>handleOnDragImg(e,'S')} >
                        <img style={{ maxWidth: '80px' }} src={ScribeImg} alt='Scribe img'/>
                    </div>

                    <div style={{border: '1px solid white', marginRight: '10px'}} draggable key={'O'.charCodeAt(0)} onDragStart={(e)=>handleOnDragImg(e,'O')}>
                        <img style={{ maxWidth: '80px' }} src={SoakImg} alt='Soak img'/>
                    </div>

                    <div style={{border: '1px solid white', marginRight: '10px'}} draggable key={'K'.charCodeAt(0)} onDragStart={(e)=>handleOnDragImg(e,'K')}>
                        <img style={{ maxWidth: '80px' }} src={CableMasterImg} alt='Cable img'/>
                    </div>
                </div>

         
            </div>
            
            



             
        

      
        </Row>
        <Row style = {{height: "90%"}}>
            <Stack direction='horizontal' gap={5} className={style.questStack}>
            {activities.tasks
                .filter((activity) => activity.isFulfilled)
                .map((activity) => (
                <QuestCard
                    key={activity.id}
                    activity={activity}
                    description={activity.title}
                    isActivityCompleted={activity?.isCompleted}
                />
                ))}
            </Stack>
        </Row>
    </div>
  )
}

export default QuestBoard
