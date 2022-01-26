/**
 * this component will serve as a User for our clothing brand site
 * the component will provide some filler information on the company without any properties
 */
import './User.css';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { useState } from 'react';
import RepoDetails from '../RepoDetails/RepoDetails';
import { getRepoList } from '../../services/GitBaseService';
const placeholder = 'https://media.istockphoto.com/vectors/person-gray-photo-placeholder-man-vector-id1202490554?k=20&m=1202490554&s=612x612&w=0&h=Pkb9bPY7CT5whOt0yZDzGivGBs_CW2fAs0btjFaHCOg=';

// User component definition
function User(props) {
    /**
     * here we hold the state of the edit/create modal 
     * that can be opened to edit the current User
     */
    const [showEdit, setShowRepos] = useState(false);

    /**
     * we also have a state variable that will tell our spinner to 
     * display when we are loading data
     */
    const [isLoaded, setIsLoaded] = useState(true);

    /**
     * we have a state variable to contain the list of the user's repos
     */
    const [reposList, setReposList] = useState([]);

    const handleShow = async () => {
        setIsLoaded(false);

        const response = await getRepoList(props.user.reposUrl);
        const responseJson = await response.json();

        setIsLoaded(true);
        setReposList(responseJson);
        setShowRepos(true);
    };

    const handleClose = () => {
        /**
         * we want to purge the repo information from memory so our application
         * does not become so heavy
         */
        setReposList([]);
        setShowRepos(false);
    };

    /**
     * function to get the name and check to see if
     * they aren't too long
     */
    const getNameDisplay = () => {
        if (props.user.name.length > 15) {
            return (<span className='green'>{props.user.name}</span>);
        } else {
            return (
                <div>
                    <span className='blue'>const </span>
                    <span className='white'>name</span>
                    <span className='blue'> = '</span>
                    <span className='green'>{props.user.name}</span>
                    <span className='blue'>'</span>
                    <span className='white'>;</span>
                </div>
            );
        }
    }

    /**
     * function to get the name and check to see if
     * they aren't too long
     */
    const getUsernameDisplay = () => {
        if (props.user.username.length > 15) {
            return (<span className='green'>{props.user.username}</span>);
        } else {
            return (
                <div>
                    <span className='blue'>let </span>
                    <span className='white'>username</span>
                    <span className='blue'> = '</span>
                    <span className='green'>{props.user.username}</span>
                    <span className='blue'>'</span>
                    <span className='white'>;</span>
                </div>
            );
        }
    }

    return (
        <div>
            <Card className='user-card'>
                <Card.Img className='user-card-img' variant="top" src={props.user.avatar ? props.user.avatar : placeholder} onClick={() => handleShow()} />
                <Card.Body className='user-card-body'>
                    {
                        !isLoaded ?
                            <Row>
                                <Col className='spinner-column'>
                                    <Spinner className='user-spinner' animation="border" variant="warning" />
                                </Col>
                            </Row> :
                            <div>
                                <Row>
                                    <Col>
                                        <Card.Title className='user-card-title yellow'>
                                            <h6>
                                                {getNameDisplay()}
                                            </h6>
                                        </Card.Title>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <a className='username' href={props.user.url} target='_blank' rel="noreferrer">
                                            {getUsernameDisplay()}
                                        </a>
                                    </Col>
                                </Row>
                            </div>
                    }
                </Card.Body>
            </Card>

            <RepoDetails
                show={showEdit}
                handleClose={handleClose}
                repos={reposList}
            />
        </div>
    );
}

/**
* we define our default property values and our expected property types
* we do this so we can be confident that this component will not be passed invalid property values
*/
User.defaultProps = {
    user: {
        id: 0,
        username: '',
        avatar: '',
        name: '',
        url: '',
        reposUrl: ''
    }
}

User.propTypes = {
    user: PropTypes.object
}

export default User;