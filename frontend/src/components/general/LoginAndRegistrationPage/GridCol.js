import { Field } from 'formik'
import { Col } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import ConfigService from '../../../services/config.service'

export function GridCol({name, colName, onUpdate}) {
  const [tests, setTests] = useState([]);
  const [selectedColloquium, setSelectedColloquium] = useState(null);
  const [checkedIndexes, setCheckedIndexes] = useState([]);
  const [questionsRated, setQuestionsRated] = useState([]);

  useEffect(() => {
    ConfigService.getAllDetails().then((response) => {
      setTests(response);
    });
  }, []);

  useEffect(() => {
    if(tests.length > 0){
      setSelectedColloquium(tests[0])
    }
  }, [tests])

  useEffect(() => {
    if(selectedColloquium!=null){
      setCheckedIndexes(Array(selectedColloquium.questionPoints.length).fill(false));
      setQuestionsRated(Array(selectedColloquium.questionPoints.length).fill(0));
    }
  }, [selectedColloquium])

  const calculateAnnihilatedPoints = () => {
    let sum = 0;
    for(let i = 0; i < checkedIndexes.length; i++){
      if(checkedIndexes[i]){
        sum += parseInt(selectedColloquium.questionPoints[i]);
      }
    }
    return sum;
  }

  const calculatePoints = () => {
    let sum = 0;
    for(let i = 0; i < questionsRated.length; i++){
      if(!checkedIndexes[i]){
        sum += parseFloat(questionsRated[i]);
      }
    }
    return sum;
  }

  const countCheckedIndexes = () => {
    let sum = 0;
    for(let i = 0; i < checkedIndexes.length; i++){
      if(checkedIndexes[i]){
        sum++;
      }
    }
    return sum;
  }

  useEffect(() => {
    onUpdate(countCheckedIndexes(),calculateAnnihilatedPoints(), calculatePoints(),selectedColloquium);
  }, [checkedIndexes, questionsRated]);

  const handleUserInput = (event,index) => {
    if(event.target.value > 0){
      const newRatings = [...questionsRated];
      newRatings[index] = event.target.value;
      setQuestionsRated(newRatings);
    }else{
      const newRatings = [...questionsRated];
      newRatings[index] = 0;
      setQuestionsRated(newRatings);
    }
  }

  const handleCheckboxChange = (event, index) => {
    if (event.target.checked) {
      const newChecks = [...checkedIndexes];
      newChecks[index] = true;
      setCheckedIndexes(newChecks);
    } else {
      const newChecks = [...checkedIndexes];
      newChecks[index] = false;
      setCheckedIndexes(newChecks);
    }
  }

  const handleSelectChange = (event) => {
    const selectedColloquium = tests.find(test => 'colloquium' + test.id === event.target.value);
    setSelectedColloquium(selectedColloquium);
    setCheckedIndexes(Array(selectedColloquium.questionPoints.length).fill(false));
    setQuestionsRated(Array(selectedColloquium.questionPoints.length).fill(0));
  }

  return (
    <Col className='form-group m-1'>
      <Field className="form-control" name={colName} as="select" onChange={handleSelectChange}>
        {tests.map((colloquium, index) => (
          <option value={'colloquium' + colloquium.id}>
            {colloquium.name}
          </option>
        ))}
      </Field>

      {selectedColloquium && (
        <div className='d-flex flex-wrap flex-row justify-content-center'>
          {selectedColloquium.questionPoints.map((question, index) => (
            <div key={index} className="p-1 d-flex flex-row justify-content-center" style={{ width: '200px' }}>
              <label className="custom-checkbox my-1">
                <input
                 type="checkbox"
                style={{ display: 'none' }}
                onChange={(event) => handleCheckboxChange(event, index)}
                 />
                <span className="checkmark"></span>
              </label>
              <p className="p-1 ">Pytanie #{index}</p>
              <input 
              className="w-25 h-75 my-1"
              onChange={(event) => handleUserInput(event,index)}
              >
              </input>
              <p className="my-1">/{question}</p>
            </div>
          ))}
        </div>
      )}
    </Col>)
}