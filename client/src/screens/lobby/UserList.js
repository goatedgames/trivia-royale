import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import './Styles.css'

function UserList({ usernames }) {
  let table = [];
  let curItem = 0;
  const rows = Math.ceil(usernames.length / 3);
  // console.log(rows)
  for (let i = 0; i < rows; i++) {
    // console.log(i);
    const nextElements = usernames.slice(curItem, curItem + 3);
    const curRow =
      (<Row key={i}>
        {nextElements.map((name, index) => <Col key={index}>{name}</Col>)}
      </Row>);
    table.push(curRow);
    curItem = curItem + 3;
  }
  return (
    <Container className="tableContent">{table}</Container>
  );
}

UserList.propTypes = {
  usernames: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired
}

export default UserList;