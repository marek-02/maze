import React, { useCallback, useEffect, useState } from 'react'
import { FIRST_COLLOQUIUM, HANDS_ON_COLLOQUIUM, ORAL_COLLOQUIUM, SECOND_COLLOQUIUM } from '../../../../utils/constants'
import ColloquiumTable from './ColloquiumTable'
import ConfigService from '../../../../services/config.service'
import { connect } from 'react-redux'
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap'
import PercentageCircle from '../../../student/PointsPage/ChartAndStats/PercentageCircle'
import { Input } from 'react-select/animated'


function ColloquiumConfiguration(props) {

  const [tests, setTests] = useState([]);

  useEffect(() => {
    ConfigService.getAllDetails().then((response) => {
      setTests(response);

    });
  }, []);

  useEffect(() => {
    if(tests.length > 0){
      setQuestions(tests[0].questionPoints)
      setSelectedTest(tests[0]);
      setTotalPossiblePoints(tests[0].maxPoints);
      setAnnihilationLimit(tests[0].annihilationLimit);
    }
  }, [tests]);


  const [questions, setQuestions] = useState([]);
  const [totalPossiblePoints,setTotalPossiblePoints] = useState(0)
  const [selectedTest, setSelectedTest] = useState(0);
  const [annihilationLimit, setAnnihilationLimit] = useState(0);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false)
  const [finishModalDescription, setFinishModalDescription] = useState(undefined)

  const calculatedPercentageValue = useCallback(() => {
    const totalMaxPoints = calculateTotalMaxPoints()
    return Math.round(100 * (totalMaxPoints / totalPossiblePoints))
  }, [questions])

  const calculateTotalMaxPoints = () => {
    return questions.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  const validateForm = () => {
    if (annihilationLimit < 0) {
      setFinishModalDescription('Ilość pytań do anihilacji nie może być mniejsza od 0.')
      return false;
    }

    if(totalPossiblePoints < 0){
      setFinishModalDescription('Ilość punktów do zdobycia nie może być mniejsza od 0.')
      return false;
    }

    if (questions.some(question => question < 0)) {
      setFinishModalDescription('Ilość punktów w pytaniach nie może być mniejsza od 0.');
      return false;
    }
  
    if (annihilationLimit > questions.length) {
      setFinishModalDescription('Ilość pytań do anihilacji nie może być większa od ilości pytań.')
      return false;
    }
  
    const sumOfQuestions = questions.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    if (sumOfQuestions !== totalPossiblePoints) {
      setFinishModalDescription('Suma punktów w pytaniach nie zgadza się z ilością punktów do zdobycia.')
      return false;
    }
  
    return true;
  }

  const handleConfigure = () => {
    setIsFinishModalOpen(true);
    if (validateForm()) {
    ConfigService.editColloquiumDetails(selectedTest.name,totalPossiblePoints,annihilationLimit, questions).then(() => {
      setFinishModalDescription('Proces konfiguracji zakończył się pomyślnie.')
    })
      .catch((error) => {
        setFinishModalDescription(`Napotkano pewne problemy. Zmiany nie zostały zapisane. <br/> ${error}`)
      })
    }
  };

  const addQuestion = () => {
    setQuestions(prevQuestions => [...prevQuestions, 0]);
  }

  const handleTestChange = (e) => {
    const selectedTest = tests[e.target.value];
    setSelectedTest(selectedTest);
    setAnnihilationLimit(selectedTest.annihilationLimit);
    setTotalPossiblePoints(selectedTest.maxPoints);
    setQuestions(selectedTest.questionPoints);
  };

  const removeQuestion = () => {
    setQuestions(prevQuestions => prevQuestions.slice(0, -1));
  };

  return (
    <div className="d-flex flex-row justify-content-center">
    <div className="d-flex flex-column align-items-center h-100 mt-3">
      <h2>Skonfiguruj Kolokowium</h2>
      <select onChange={handleTestChange}>
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
      </div>
      <div className="d-flex flex-column gap-4" style={{ height: '200px', width: '200px', marginTop: '80px' }}>
        <PercentageCircle
          percentageValue={calculatedPercentageValue()}
          points={calculateTotalMaxPoints()}
          maxPoints={totalPossiblePoints}
        />

        <label>
        Ilość pytań do anihilacji
        <input
          
          type="number"
          value={annihilationLimit}
          onChange={(event) => setAnnihilationLimit(parseInt(event.target.value))}
        />
        </label>

        <label>
        Punkty do zdobycia
        <input
          type="number"
          value={totalPossiblePoints}
          onChange={(event) => setTotalPossiblePoints(parseInt(event.target.value))}
        />
        </label>  
      </div>


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