import { Field } from 'formik'
import { Col } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import ConfigService from '../../../services/config.service'

export function GridCol({name, colName}) {
  const [tests, setTests] = useState([]);
  const [selectedColloquium, setSelectedColloquium] = useState(null);

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

  const handleSelectChange = (event) => {
    const selectedColloquium = tests.find(test => 'colloquium' + test.id === event.target.value);
    setSelectedColloquium(selectedColloquium);
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
                <input type="checkbox" style={{ display: 'none' }} />
                <span className="checkmark"></span>
              </label>
              <p className="p-1 ">Pytanie #{index}</p>
              <input className="w-25 h-75 my-1"></input>
              <p className="my-1">/{question}</p>
            </div>
          ))}
        </div>
      )}
    </Col>)
}