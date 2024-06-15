import { Table} from 'react-bootstrap'
import styled from 'styled-components'

export const Title = styled.div`
  font-size: 48px;
  font-weight: 500;
  text-align: center !important;
  margin: 0 auto;
`
export const TableContainer = styled(Table)`
  color: ${(props) => props.$fontColor};
  margin-bottom: 0;

  th {
    background-color: ${(props) => props.$background};
    border: ${(props) => props.$background} 1px solid;
  }

  tr {
    border: ${(props) => props.$background} 1px solid;
  }
  td {
    background-color: ${(props) => props.$tdColor}; // light
    border: ${(props) => props.$background} 1px solid;
  }

  thead {
    position: sticky;
    top: 0; /* Don't forget this, required for the stickiness */
  }

  & tbody tr td {
    vertical-align: middle;
  }

  td:hover{
    background-color: lightblue;
  }
`
