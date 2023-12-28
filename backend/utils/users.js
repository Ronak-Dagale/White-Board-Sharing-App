// Array to store user data
const users = [];

// Function to add a user to the users array
const addUser = ({ name, userId, roomId, host, presenter }) => {
    const user = { name, userId, roomId, host, presenter };
    users.push(user); // Add the user to the array
    return users.find((user) => user.roomId === roomId); // Return the added user
};

// Function to remove a user from the users array by their ID
const removeUser = (id) => {
    const index = users.findIndex((user) => user.userId === id); // Find the index of the user by their ID
    if (index !== -1) {
        return users.splice(index, 1)[0]; // Remove the user from the array and return the removed user
    }
    return users; // Return the users array if the user is not found
};

// Function to get a user from the users array by their ID
const getUser = (id) => {
    return users.find((user) => user.userId === id); // Find and return the user by their ID
};

// Function to get all users in a specific room
const getUsersInRoom = (roomId) => {
    return users.find((user) => user.roomId === roomId); // Find and return users in the specified room
};

// Exporting functions for use in other modules
module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};
