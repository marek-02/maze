import React, { useState } from 'react';
import { Button, Row, Stack, Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import style from './QuestBoard.module.scss';
import { useAppSelector } from '../../../../hooks/hooks';
import { isMobileView } from '../../../../utils/mobileHelper';
import { ScribeImg, SoakImg, EconomistImg, CableMasterImg, PlaceholderImg } from '../../../../utils/constants';
import StudentService from '../../../../services/student.service';
import styles from '../../../../common/components/ActivityDetails/ActivityDetails.module.scss';
import { useActivities } from '../../../../hooks/useActivities';
import { useStudentsOfSubgroup } from '../../../../hooks/useStudentsOfSubgroup';
import QuestCard from '../QuestCard/QuestCard';

const QuestBoard = () => {
  const selectedChapterId = useAppSelector((state) => state.user.selectedChapterId);
  const courseId = useAppSelector((state) => state.user.courseId);
  const activities = useActivities(selectedChapterId ?? 0); // Provide a default value of 0
  const [studentsOfSubgroup, setStudentsOfSubgroup] = useStudentsOfSubgroup(courseId);
  const isMobileDisplay = isMobileView();

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [finishModalDescription, setFinishModalDescription] = useState('');

  function handleOnDragImg(event: any, roleKey: string) {
    event.dataTransfer.setData("role", roleKey);
  }

  function handleOnDrop(event: any, index: number) {
    let role = event.dataTransfer.getData("role");
    if (role === "") { // student was dropped instead of img, we call the other onDrop func
      return;
    }

    const student = studentsOfSubgroup[index];
    student.role = role;

    let tmp = studentsOfSubgroup.slice(); // Create a shallow copy of the array
    tmp[index] = student; // Update the specific student in the copy

    setStudentsOfSubgroup(tmp); // Update the state with the new array
  }

  function handleDragOver(event: any) {
    event.preventDefault();
  }

  function getClassImgSrcById(id: string) {
    switch (id) {
      case "S": return ScribeImg;
      case "E": return EconomistImg;
      case "O": return SoakImg;
      case "K": return CableMasterImg;
      case "": return null;
    }
  }

  function saveStudentRoles() {
    const roleCounts = studentsOfSubgroup.reduce((acc: any, student: any) => {
      acc[student.role] = (acc[student.role] || 0) + 1;
      return acc;
    }, {});
  
    const duplicates = Object.keys(roleCounts).filter(role => roleCounts[role] > 1);
  
    if (duplicates.length > 0) {
      setFinishModalDescription(`Role nie mogą się powtarzać.`);
      setIsFinishModalOpen(true);
      return;
    }
  
    studentsOfSubgroup.forEach((student: any) => {
      StudentService.changeStudentRole(student.id, student.role, courseId)
    });
  
    setFinishModalDescription('Role zostały zapisane.');
    setIsFinishModalOpen(true);
  }

  return (
    <div style={{ height: '100%', position: 'relative', }} className={style.board}>
      <Row style={{ height: "20%", width: '100%', paddingTop:"7px" }} >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ marginRight: '100px' }}>
            <div style={{ display: "flex", justifyContent: 'center' }}>
              {
                studentsOfSubgroup.length > 0 && studentsOfSubgroup?.map((student: any, index: number) => {
                  return (
                    <div className={style.icon} onDrop={(e) => { handleOnDrop(e, index) }} onDragOver={handleDragOver}
                      style={{ width: '100px', height: '80px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: "center", marginBottom:"5px"}}>
                      <img style={{maxWidth: '80px'}} src={getClassImgSrcById(student.role) || PlaceholderImg}/>
                    </div>
                  );
                  })
              }
            </div>
            <div style={{ display: "flex", justifyContent: 'center' }}>
              {
                studentsOfSubgroup.length > 0 && studentsOfSubgroup?.map((student: any, index: number) => {
                  return (
                    <div className={style.icon} style={{ width: '100px', height: '80px', textAlign: 'center', display: 'flex', alignItems: 'center', wordBreak: "break-word" }}>
                      {student.firstName} {student.lastName}
                    </div>
                  );
                })
              }
            </div>
          </div>

          <div style={{ display: "flex" }} onDrop={(e) => { }} onDragOver={handleDragOver}>
            <div className={style.icon} draggable key={'E'.charCodeAt(0)} onDragStart={(e) => handleOnDragImg(e, 'E')}>
              <img style={{ maxWidth: '80px' }} src={EconomistImg} alt='Econom img' />
            </div>

            <div className={style.icon} draggable key={'S'.charCodeAt(0)} onDragStart={(e) => handleOnDragImg(e, 'S')}>
              <img style={{ maxWidth: '80px' }} src={ScribeImg} alt='Scribe img' />
            </div>

            <div className={style.icon} draggable key={'O'.charCodeAt(0)} onDragStart={(e) => handleOnDragImg(e, 'O')}>
              <img style={{ maxWidth: '80px' }} src={SoakImg} alt='Soak img' />
            </div>

            <div className={style.icon} draggable key={'K'.charCodeAt(0)} onDragStart={(e) => handleOnDragImg(e, 'K')}>
              <img style={{ maxWidth: '80px' }} src={CableMasterImg} alt='Cable img' />
            </div>
          </div>

          <Button variant='primary' onClick={saveStudentRoles} className={`${styles.startActivityButton}`}>
            Zapisz
          </Button>
          <Modal show={isFinishModalOpen} onHide={() => setIsFinishModalOpen(false)}>
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
        </div>
      </Row>
      <div className={style.wood}></div>
      <Row style={{ height: "80%" }}>
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
  );
};

export default QuestBoard;