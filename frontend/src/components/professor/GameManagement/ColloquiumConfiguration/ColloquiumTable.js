import React from 'react';
import { Table } from 'react-bootstrap'
import { connect } from 'react-redux'
import { TableContainer, TableRow } from '../../../general/Ranking/RankingStyle'

function ColloquiumTable({ questions, setQuestions, theme }) {


  const handleMaxPointsChange = (index, event) => {
    const newQuestions = [...questions];
    const newValue = parseInt(event.target.value);
    newQuestions[index] = isNaN(newValue) ? 0 : newValue;
    setQuestions(newQuestions);
  };

  const rowColor = (index) => theme.success

  return (
    <TableContainer
      $customHeight={'60vh'}
      $fontColor={theme.font}
      $backgroundColor={theme.primary}
    >

    <Table >
      <thead>
      <tr>
        <th>Numer pytania</th>
        <th>Ilość punktów</th>
      </tr>
      </thead>
      <tbody>
      {questions.map((points, index) => (
        <TableRow
          key={index + Date.now()}
          $backgroundColor={theme.secondary}
          $hoverColor={theme.primary}
        >
          <td>{index}</td>
          <td>
            <input
              type="number"
              value={points}
              onChange={(event) => handleMaxPointsChange(index, event)}
            />
          </td>
        </TableRow>
      ))}
      </tbody>
    </Table>
    </TableContainer>
  );
}

function mapStateToProps(state) {
  const {theme} = state
  return {
    theme
  }
}
export default connect(mapStateToProps)(ColloquiumTable);