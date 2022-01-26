/**
 * this is our gitbase controller
 * we will be retrieving user data from the following two api enpoints:
 * - https://api.github.com/users
 * - https://gitlab.com/api/v4/users
 */
const fetch = require('node-fetch');
const gitHubBaseUrl = process.env.GITHUB_BASE_URL || 'https://api.github.com';
const gitLabBaseUrl = process.env.GITLAB_BASE_URL || 'https://gitlab.com/api/v4';
const gitHubAccessToken = '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';
const gitLabAccessToken = 'glpat-6ssysGeNyW6xThgRXCv-';

/**
 * this function will grab a user list from by either using a username or just getting a list of all users
 */
const fetchUsers = async (userParam) => {
    /**
     * we want to create a list of users and populate it 
     * with information from both the gitlabs api and the github api
     */
    const userList = [];

    const gitHubResponse = await fetch(`${gitHubBaseUrl}/users${userParam ? '/' + userParam : ''}`, {
        headers: {
            'Authorization': `token ${gitHubAccessToken}`
        }
    });

    let gitHubUserList = [];

    if (userParam) {
        gitHubUserList.push(await gitHubResponse.json());
    }
    else {
        gitHubUserList = await gitHubResponse.json();
    }

    /**
     * small function to grab GH name
     */
    const getGitHubName = async (url) => {
        const nameResponse = await fetch(url, {
            headers: {
                'Authorization': `token ${gitHubAccessToken}`
            }
        });

        const responseJson = await nameResponse.json();
        return responseJson.name || 'anonymous';
    };

    /**
     * we iterate through the gh list of users and map the info to 
     * an acceptable dto
     */
    for (const user of gitHubUserList) {
        if (user.id && user.login && user.avatar_url && user.html_url && user.url && user.repos_url) {
            userList.push({
                id: user.id,
                username: user.login,
                name: await getGitHubName(user.url),
                avatar: user.avatar_url,
                url: user.html_url,
                reposUrl: Buffer.from(user.repos_url).toString('base64')
            });
        }
    }

    /**
     * now we want to grab the same information from the gitlab endpoint
     */
    const gitLabResponse = await fetch(`${gitLabBaseUrl}/users?${userParam ? 'username=' + userParam + '&' : ''}private_token=${gitLabAccessToken}`);
    const gitLabUserList = await gitLabResponse.json();

    /**
     * we iterate through the gl list of users and map the info to 
     * an acceptable dto
     */
    for (const user of gitLabUserList) {
        if (user.id && user.name && user.username && user.avatar_url && user.web_url) {
            userList.push({
                id: user.id,
                username: user.username,
                name: user.name,
                avatar: user.avatar_url,
                url: user.web_url,
                reposUrl: Buffer.from(`${gitLabBaseUrl}/users/${user.id}/projects`).toString('base64')
            });
        }
    }

    return userList;
};

/**
 * this function will return a list of all gitbase in the gitbase dataset
 */
const getUserList = async (request, response) => {
    console.log(`${request.url} (GET) hit`);

    try {
        const userList = await fetchUsers(null);
        response.status(200).json(userList);
    }
    catch (error) {
        response.status(500).send('Oops... Something went wrong...');
    }
};


/**
 * this function will return a gitbase object from the gitbase dataset using the id specified in the request url
 */
const getUserByName = async (request, response) => {
    console.log(`${request.url} (GET) hit`);

    try {
        const userList = await fetchUsers(request.params.username);
        response.status(200).json(userList);
    }
    catch (error) {
        response.status(500).send('Oops... Something went wrong...');
    }
};

/**
 * this function will fetch the a user's repository information
 */
const getUserRepo = async (request, response) => {
    console.log(`${request.url} (GET) hit`);

    try {
        /**
         * we want to grab a list of all of the user's repos and return information 
         * about them
         * our repo_url is base 64 encoded so we need to decode it first
         */
        const reposUrl = Buffer(request.params.repo_url, 'base64').toString();
        const repoList = [];

        if (reposUrl.startsWith('https://gitlab.com/')) {
            /**
             * we want to grab the same information from the gitlab endpoint
             */
            const gitLabResponse = await fetch(`${reposUrl}?private_token=${gitLabAccessToken}`);
            const gitLabRepoList = await gitLabResponse.json();

            /**
             * a function to get commits from a repo
             */
            const gitLabRepoCommits = async (url) => {
                const commitsList = [];
                const commitsResponse = await fetch(url);
                const responseJson = await commitsResponse.json();

                if (responseJson.length) {
                    let commitCount = 0;

                    for (const commit of responseJson) {
                        if (commitCount > 4) {
                            break;
                        }

                        commitsList.push({
                            author: {
                                name: commit.author_name,
                                date: commit.authored_date
                            },
                            message: commit.message
                        });

                        commitCount++;
                    }
                }

                return commitsList;
            }

            /**
             * we want to take this repos list and extract only the useful information from it
             */
            for (const repo of gitLabRepoList) {
                if (repo.id && repo.path_with_namespace && 'description' in repo && repo.forks_count > -1 && repo.created_at && repo.last_activity_at && repo.web_url) {
                    repoList.push({
                        name: repo.path_with_namespace,
                        description: repo.description,
                        forks: repo.forks_count,
                        created: repo.created_at,
                        updated: repo.last_activity_at,
                        url: repo.web_url,
                        commits: await gitLabRepoCommits(`${gitLabBaseUrl}/projects/${repo.id}/repository/commits?private_token=${gitLabAccessToken}`)
                    });
                }
            }
        }
        else {
            const gitHubResponse = await fetch(reposUrl, {
                headers: {
                    'Authorization': `token ${gitHubAccessToken}`
                }
            });

            const gitHubRepoList = await gitHubResponse.json();

            /**
             * a function to get commits from a repo
             */
            const gitHubRepoCommits = async (url) => {
                const commitsList = [];

                const commitsResponse = await fetch(url.replace('{/sha}', ''), {
                    headers: {
                        'Authorization': `token ${gitHubAccessToken}`
                    }
                });

                const responseJson = await commitsResponse.json();

                if (responseJson.length) {
                    let commitCount = 0;

                    for (const commit of responseJson) {
                        if (commitCount > 4) {
                            break;
                        }

                        commitsList.push({
                            author: commit.commit.author,
                            message: commit.commit.message
                        });

                        commitCount++;
                    }
                }

                return commitsList;
            }

            /**
             * we want to take this repos list and extract only the useful information from it
             */
            for (const repo of gitHubRepoList) {
                if (repo.full_name && 'description' in repo && repo.forks_count > -1 && repo.created_at && repo.updated_at && repo.html_url && repo.commits_url) {
                    repoList.push({
                        name: repo.full_name,
                        description: repo.description,
                        forks: repo.forks_count,
                        created: repo.created_at,
                        updated: repo.updated_at,
                        url: repo.html_url,
                        commits: await gitHubRepoCommits(repo.commits_url)
                    });
                }
            }
        }

        response.status(200).json(repoList);
    }
    catch (error) {
        response.status(500).send('Oops... Something went wrong...');
    }
};

/**
 * here we export our functions so they are accessible outside of this document
 */
module.exports = {
    getUserByName,
    getUserList,
    getUserRepo
};