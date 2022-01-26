/**
 * this file will be used to send and handle http requests to our express backend
 * this service can be imported into any component that will need to interact with the gitbase api
 */

/**
 * this function can be used to retrieve a list of users from the gitbase api
 */
const getUserList = async () => {
    return fetch('/gitbase');
};

/**
 * this function can be used to create a new gitbase through the gitbase api
 */
const getUserByName = async (username) => {
    return fetch(`/gitbase/${username}`);
}

/**
 * this function can be used to list of user repos through the gitbase api
 */
 const getRepoList = async (reposUrl) => {
    return fetch(`/gitbase/repos/${reposUrl}`);
}

export {
    getUserList,
    getUserByName,
    getRepoList
}