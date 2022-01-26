/**
 * this page serves to bring together each one of our components
 * from this page you will be able to view, create, edit and delete car objects
 */
import './RepoDetails.css';
import { Modal, ListGroup, ListGroupItem, Row, Col } from 'react-bootstrap';
import { PropTypes } from 'prop-types';

function RepoDetails(props) {
    return (
        <Modal size='xl' className='repo-modal' scrollable show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Repos</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modal-body'>
                {
                    props.repos.length ?
                        <ListGroup>
                            {props.repos.map((repo, repoIndex) =>
                                <ListGroupItem className='repo-details' key={`details_${repoIndex}`}>
                                    <Row>
                                        <Col className='green'><b>Repo Details</b></Col>
                                    </Row>
                                    <Row>
                                        <Col className='white'>name: {repo.name}</Col>
                                        <Col className='white'><span className='right'>{repo.created.includes('T') ? repo.created.split('T')[0] : ''} - created</span></Col>
                                    </Row>
                                    <Row>
                                        <Col className='white'>description: {repo.description}</Col>
                                        <Col className='white'><span className='right'>{repo.updated.includes('T') ? repo.updated.split('T')[0] : ''} - last updated</span></Col>
                                    </Row>
                                    <Row>
                                        <Col className='white'>forks count: {repo.forks}</Col>
                                        <Col className='white'><span className='right'><a href={repo.url} target="_blank" rel='noreferrer'>{repo.url}</a> - url</span></Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col className='blue'><b>Latest Commits</b></Col>
                                    </Row>
                                    <Row>
                                        <ListGroup>
                                            {repo.commits.map((commit, commitIndex) =>
                                                <ListGroupItem className='commit-details' key={`commits_${commitIndex}`}>
                                                    <Row>
                                                        <Col className='yellow'><h6>{commit.author.name} <small>{`${commit.author.date.includes('T') ? commit.author.date.split('T')[0] : ''}`}</small></h6></Col>
                                                    </Row>
                                                    <Row>
                                                        <Col className='white'>{commit.message}</Col>
                                                    </Row>
                                                </ListGroupItem>
                                            )}
                                        </ListGroup>
                                    </Row>
                                </ListGroupItem>
                            )}
                        </ListGroup> :
                        <h4 className='green'>Hmm... It looks like this user doesn't have any projects...</h4>
                }
            </Modal.Body>
        </Modal>
    );
}

/**
* we define our default property values and our expected property types
* we do this so we can be confident that this component will not be passed invalid property values
*/
RepoDetails.defaultProps = {
    repos: [
        {
            name: '',
            description: '',
            forks: 0,
            created: '',
            updated: '',
            url: '',
            commits: [],
        }
    ],
    show: false
}

RepoDetails.propTypes = {
    repos: PropTypes.array,
    show: PropTypes.bool
}

export default RepoDetails;