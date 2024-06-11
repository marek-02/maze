import React, { useState } from 'react';
import { FIRST_COLLOQUIUM, HANDS_ON_COLLOQUIUM, ORAL_COLLOQUIUM, SECOND_COLLOQUIUM } from '../../../../utils/constants'
import ColloquiumTable from './ColloquiumTable'
import { connect } from 'react-redux'

function ColloquiumConfiguration(props) {
  const tests = [
    { name: FIRST_COLLOQUIUM },
    { name: SECOND_COLLOQUIUM },
    { name: HANDS_ON_COLLOQUIUM },
    { name: ORAL_COLLOQUIUM },
  ];

  const [selectedTest, setSelectedTest] = useState(tests[0]);
  const [questions, setQuestions] = useState([]);

  const handleConfigure = () => {
    // Handle configuration logic here
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