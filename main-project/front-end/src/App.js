/**
 * this page serves to bring together each one of our components
 * from this page you will be able to view, create, edit and delete user objects
 */
import './App.css';
import UserList from './components/UserList/UserList';
import { Container, Alert, Spinner } from 'react-bootstrap';
import User from './components/User/User';
import { useState, useEffect } from 'react';
import { getUserList } from './services/GitBaseService';

function App() {
  /**
   * we hold our users list in this component's state
   */
  const [userList, setUsersList] = useState([]);

  /**
   * we also have a state variable that will tell our spinner to 
   * display when we are loading data
   */
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * we have a state variable that will contain error messages 
   * for potential errors that occur
   */
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * here we make use of the useEffect react method to grab our list of users
   * before the component is fully mounted
   */
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUserList();

      if (response.status !== 200) {
        setErrorMessage('Oops... Look like something went wrong. Please contact the site owner.');
      }
      else {
        const responseData = await response.json();
        setIsLoaded(true);
        setUsersList(responseData);
      }
    }

    fetchUsers();
  }, []);

  return (
    <Container>
      {errorMessage ? <Alert className='error-message' variant='danger'>{errorMessage}</Alert> : ''}
      {
        !isLoaded ?
          <div>
            <Spinner className='spinner' animation="border" variant="warning" />
          </div> :
          <UserList userList={userList.map(user =>
            <User
              user={user}
            />
          )}
            setUsersList={setUsersList}
            setErrorMessage={setErrorMessage}
          />
      }
    </Container>
  );
}

export default App;