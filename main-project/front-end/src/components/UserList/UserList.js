/**
 * this component will serve as a UserList for our clothing brand site
 * the component will provide some filler information on the company without any properties
 */
import './UserList.css';
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import { PropTypes } from 'prop-types';
import { getUserByName } from '../../services/GitBaseService';
import { useState } from 'react';

// UserList component definition
function UserList(props) {
    /**
     * a state variable that will be responsible for our loading spinner
     */
    const [isLoaded, setIsLoaded] = useState(true);

    /**
     * this is a function that will handle the enter key press
     * upon user search
     */
    const handleKeyPress = async (event, username) => {
        if (event.key === 'Enter') {
            setIsLoaded(false);

            event.preventDefault();

            const response = await getUserByName(username.trim());

            if (response.status !== 200) {
                props.setErrorMessage('Oops... Look like something went wrong. Please contact the site owner.');
            }
            else {
                const responseData = await response.json();
                setIsLoaded(true);
                props.setUsersList(responseData);
            }
        }
    }
    return (
        <div className='content'>
            <Container>
                <Form>
                    <Form.Group className="mb-3" controlId="usernameSearch">
                        <Form.Control type="text" placeholder="e.g. JohnSnow98" onKeyPress={(event) => handleKeyPress(event, event.target.value)} />
                        <Form.Text className="blue">search for a user by entering their username in the above text field then hit <span className='yellow'>(ENTER)</span></Form.Text>
                    </Form.Group>
                </Form>
                {
                    !isLoaded ?
                        <Spinner className='spinner' animation="border" variant="warning" /> :
                        <Row>
                            {props.userList.length ? props.userList.map((user, index) => <Col xs={12} lg={4} xxl={3} key={index}>{user}</Col>) : <h1 className='yellow'>Sorry... We couldn't find any users with that name...</h1>}
                        </Row>
                }
            </Container>
        </div>
    );
}

/**
* we define our default property values and our expected property types
* we do this so we can be confident that this component will not be passed invalid property values
*/
UserList.defaultProps = {
    userList: []
}

UserList.propTypes = {
    userList: PropTypes.array,
    setUsersList: PropTypes.func,
    setErrorMessage: PropTypes.func
}

export default UserList;