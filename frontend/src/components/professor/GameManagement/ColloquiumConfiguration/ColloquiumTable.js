import React from 'react';
import { Table } from 'react-bootstrap'

function ColloquiumTable({ questions, setQuestions }) {
  const handleMaxPointsChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].maxPoints = event.target.value;
    setQuestions(newQuestions);
  };

  return (
    <Table>
      <thead>
      <tr>
        <th>Question Number</th>
        <th>Max Points</th>
      </tr>
      </thead>
      <tbody>
      {questions.map((question, index) => (
        <tr key={index}>
          <td>{question.number}</td>
          <td>
            <input 
              type="number" 
              value={question.maxPoints} 
              onChange={(event) => handleMaxPointsChange(index, event)}
            />
          </td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
}

export default ColloquiumTable;