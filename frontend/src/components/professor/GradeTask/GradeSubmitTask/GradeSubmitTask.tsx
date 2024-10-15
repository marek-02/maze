import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import styles from './GradeSubmitTask.module.scss';
import { useEvaluateSubmitTaskMutation, useGradeSubmitTaskMutation } from '../../../../api/apiGrades';
import { ActivityResponseInfo } from '../../../../api/types';
import CombatTaskService from '../../../../services/combatTask.service';
import { Activity, getActivityTypeName } from '../../../../utils/constants';
import StudentFileService from '../../ActivityAssessmentDetails/StudentFileService';

type GradeSubmitTaskProps = {
  showDetails: boolean;
  onCloseDetails: () => void;
  activity: ActivityResponseInfo;
};

const GradeSubmitTask = (props: GradeSubmitTaskProps) => {
  const [chapterId, setChapterId] = useState<string>('1')
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState<boolean>(false);
  const [activityDetails, setActivityDetails] = useState<ActivityResponseInfo>({
    ...props.activity,
  });

  const [gradeSubmitTask] = useGradeSubmitTaskMutation();
  const [evaluateSubmitTask] = useEvaluateSubmitTaskMutation();

  const handleSubmit = async (accepted: boolean) => {
    try {
      if (!accepted) {
        await evaluateSubmitTask({
          id: props.activity.fileTaskResponseId,
          accepted: false,
        }).then(() => {
          props.onCloseDetails();
          setIsAddActivityModalOpen(false);
        });
      }

      const response = await gradeSubmitTask(props.activity.fileTaskResponseId);

      if ('data' in response) {
        setActivityDetails(response.data);
      }

      setActivityDetails((prevDetails) => ({
        ...prevDetails,
        ['auction']: null,
      }));

      setIsAddActivityModalOpen(true);
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleCreateTask = () => {
    setActivityDetails((prevDetails) => ({
      ...prevDetails,
      ['auction']: null,
    }));
    // console.log(activityDetails);
    CombatTaskService.setFileTaskJson({ chapterId, form: activityDetails})
        .then(() => {
          evaluateSubmitTask({
            id: props.activity.fileTaskResponseId,
            accepted: true
          })
          props.onCloseDetails()
          setIsAddActivityModalOpen(false)
        })
        .catch((response) => {
          console.error(response)
        })
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setActivityDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
      <>
        {props.activity ? (
            <Modal
                fullscreen
                show={props.showDetails}
                onHide={props.onCloseDetails}
                size="xl"
                className={styles.modalContainer}
                centered
            >
              <Modal.Header className={styles.modalHeader}>
                <Modal.Title className={styles.modalTitle}>
                  {`${getActivityTypeName(Activity.SUBMIT)} - ${props.activity.activityName}`}
                </Modal.Title>
                <button
                    type="button"
                    className={styles.customButtonClose}
                    onClick={() => {
                      props.onCloseDetails();
                    }}
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
                  <p>{`${props.activity.userTitle} - ${props.activity.userContent}`}</p>
                  <StudentFileService activity={props.activity} />
                </div>
              </Modal.Body>
              <Modal.Footer className={styles.modalFooter}>
                <Button
                    variant="secondary"
                    type="submit"
                    className={styles.rejectButton}
                    onClick={() => handleSubmit(false)}
                >
                  <span>Odrzuć</span>
                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    className={styles.acceptButton}
                    onClick={() => handleSubmit(true)}
                >
                  <span>Stwórz zadanie</span>
                </Button>
              </Modal.Footer>
            </Modal>
        ) : null}
        <Modal
            show={isAddActivityModalOpen}
            onHide={() => setIsAddActivityModalOpen(false)}
            size="xl"
            centered
            fullscreen
        >
          <Modal.Header style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            Dodawanie nowej aktywności
          </Modal.Header>
          <Modal.Body className={styles.editorContainer}>
            <Row>
              <Col>
                <p>
                  <strong>Chapter ID:</strong> {chapterId}
                </p>
              </Col>
              <Col>
                <p>
                  <strong>Based On:</strong> {activityDetails.basedOn}
                </p>
              </Col>
              <Col>
                <p>
                  <strong>Rodzaj aktywności:</strong> {activityDetails.activityType}
                </p>
              </Col>
            </Row>
            <hr />
            <Form className={styles.formContainer}>
              <Form.Group controlId="title" className={styles.formGroup}>
                <Form.Label>
                  <span>Tytuł</span>
                </Form.Label>
                <Form.Control
                    type="text"
                    name="title"
                    rows={1}
                    as="textarea"
                    value={activityDetails.title}
                    onChange={handleInputChange}
                    className={styles.formControl}
                />
              </Form.Group>

              <Form.Group controlId="description" className={styles.formGroup}>
                <Form.Label>
                  <span>Opis</span>
                </Form.Label>
                <Form.Control
                    type="text"
                    name="description"
                    as="textarea"
                    rows={3}
                    value={activityDetails.description}
                    onChange={handleInputChange}
                    className={styles.formControl}
                />
              </Form.Group>

              <Form.Group controlId="posX" className={styles.formGroup}>
                <Form.Label>
                  <span>Pozycja X</span>
                </Form.Label>
                <Form.Control
                    type="number"
                    name="posX"
                    value={activityDetails.posX}
                    onChange={handleInputChange}
                    className={styles.formControl}
                />
              </Form.Group>

              <Form.Group controlId="posY" className={styles.formGroup}>
                <Form.Label>
                  <span>Pozycja Y</span>
                </Form.Label>
                <Form.Control
                    type="number"
                    name="posY"
                    value={activityDetails.posY}
                    onChange={handleInputChange}
                    className={styles.formControl}
                />
              </Form.Group>

              <Form.Group controlId="taskContent" className={styles.formGroup}>
                <Form.Label>
                  <span>Treść zadania</span>
                </Form.Label>
                <Form.Control
                    type="text"
                    name="taskContent"
                    as="textarea"
                    rows={3}
                    value={activityDetails.taskContent}
                    onChange={handleInputChange}
                    className={styles.formControl}
                />
              </Form.Group>

              <Form.Group controlId="maxPoints" className={styles.formGroup}>
                <Form.Label>
                  <span>Maksymalna liczba punktów</span>
                </Form.Label>
                <Form.Control
                    type="number"
                    name="maxPoints"
                    value={activityDetails.maxPoints}
                    onChange={handleInputChange}
                    className={styles.formControl}
                />
              </Form.Group>
            </Form>
            <Button
                type="submit"
                className={styles.editorButton}
                onClick={handleCreateTask}
            >
              Dodaj aktywność
            </Button>
          </Modal.Body>
        </Modal>
      </>
  );
};

export default GradeSubmitTask;
