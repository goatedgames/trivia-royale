import React from 'react';
import PropTypes from 'prop-types';

const UserList = ({ usernames }) => (
  <ul>
    {usernames.map(name => (
      <li>{name}</li>
    ))}
  </ul>
);

UserList.propTypes = {
  usernames: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired
}

export default UserList;