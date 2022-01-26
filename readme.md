# GitBase

## Setup
- Run `npm install` from the root directory to download the project dependencies

## Run Client and Server Concurrently
- Run `npm run start:dev` to run both the React Client and Express API concurrently

## Testing

### Automated Testing
In order to test this project using the `Jest` test suite simply run the `npm test` command from the root folder of this project

### API Testing
In order to test the API manually, open your HTTP request testing platform of choice and hit any of the following endpoints:

_Note: the PORT used in the example will differ if you have set your own environment variable_

#### Base URL
`http://localhost:3001/gitbase`

### Get User List
`http://localhost:3001/gitbase/`

### Get User By Name
`http://localhost:3001/gitbase/:username`

## Get Repo List
`http://localhost:3001/gitbase/repos/:repo_url`