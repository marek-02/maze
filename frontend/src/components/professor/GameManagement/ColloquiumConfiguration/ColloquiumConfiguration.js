import React, { useState } from 'react';
import { FIRST_COLLOQUIUM, HANDS_ON_COLLOQUIUM, ORAL_COLLOQUIUM, SECOND_COLLOQUIUM } from '../../../../utils/constants'
import ColloquiumTable from './ColloquiumTable'
import ConfigService from '../../../../services/config.service'
import { connect } from 'react-redux'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'


function ColloquiumConfiguration(props) {

  const tests = [
    { name: "FIRST_COLLOQUIUM" },
    { name: "SECOND_COLLOQUIUM" },
    { name: "HANDS_ON_COLLOQUIUM" },
    { name: "ORAL_COLLOQUIUM" },
  ];

  const [selectedTest, setSelectedTest] = useState(tests[0]);
  const [questions, setQuestions] = useState([]);
  const [annihilatedLimit, setAnnihilatedLimit] = useState(0);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false)
  const [finishModalDescription, setFinishModalDescription] = useState(undefined)



  const handleConfigure = () => {
    console.log(questions)
    ConfigService.editColloquiumDetails(selectedTest.name, annihilatedLimit, [1,2,3]).then(() => {
      setFinishModalDescription('Proces przyznawania punktów zakończył się pomyślnie.')
    })
      .catch((error) => {
        setFinishModalDescription(`Napotkano pewne problemy. Punkty nie zostały przyznane. <br/> ${error}`)
      })
  };
  
  const addQuestion = () => {
    setQuestions(prevQuestions => [...prevQuestions, { number: prevQuestions.length + 1, maxPoints: 0 }]);
  };

  const removeQuestion = () => {
    setQuestions(prevQuestions => prevQuestions.slice(0, -1));
  };

  return (
    <div className="d-flex flex-column align-items-center h-100 mt-3 p-20">
      <h2>Skonfiguruj Kolokowium</h2>
      <select onChange={(e) => setSelectedTest(tests[e.target.value])}>
        {tests.map((test, index) => (
          <option key={test.name} value={index}>
            {test.name}
          </option>
        ))}
      </select>
      <ColloquiumTable questions={questions} setQuestions={setQuestions} theme={props.theme} />
      <div className='flex flex-row mt-4'>
        <button className='m-2' onClick={addQuestion}>Dodaj pytanie</button>
        <button onClick={removeQuestion}>Usuń pytanie</button>
      </div>

      <button onClick={handleConfigure}>Zapisz</button>

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
    </div>
  );

}

function mapStateToProps(state) {
  const { theme } = state
  return {
    theme
  }
}
export default connect(mapStateToProps)(ColloquiumConfiguration)