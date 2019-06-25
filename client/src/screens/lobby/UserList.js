import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import './Styles.css'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/* const UserList = ({ usernames }) => (
   <ul>
    {usernames.map(name => (
      <li>{name}</li>
    ))}
  </ul>
  <Container>
    <Row>
      {usernames.map(name => (
      <Col>{name}</Col>
      ))}
    </Row>
  </Container> */
function UserList({usernames}){
  const positioning = {
    position: 'absolute',
    left: '50%',
    top: '45%',
    transform: 'translate(-50%, -50%)'
  }
  let table=[];
  let curItem = 0;
  const rows = Math.ceil(usernames.length/3);
  console.log(rows)
  for (let i=0;i<rows;i++){
    console.log(i);
    let nextElements = usernames.slice(curItem,curItem+3);
    let curRow = 
      (<Row>
        {nextElements.map(name => (
          <Col>{name}</Col>
        ))}
      </Row>);
    table.push(curRow);
    curItem = curItem + 3;
  }
  return (<Container className="tableContent">{table}</Container>);
}
UserList.propTypes = {
  usernames: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired
}

export default UserList;