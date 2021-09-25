const users = [];

function userJoin(message, user, userName, id, time) {
  const userN = { message, user, userName, id, time };

  users.push(userN);
  return userN;
}

function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

module.exports = {
  userJoin,
  userLeave,
};
