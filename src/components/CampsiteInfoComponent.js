import React, { Component } from 'react';
import {Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label} from 'reactstrap';
import { Link } from 'react-router-dom';
import { LocalForm, Control, Errors} from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

    function RenderCampsite({campsite}) {
        return (<div className="col-md-5 m-1">
                    <FadeTransform
                    in 
                    transformProps={{
                        exitTransform: 'scale(0.5) translateY(-50%)'
                    }}>
                        <Card>
                            <CardImg top src={campsite.image} alt={campsite.name} />
                            <CardBody>
                                <CardText>{campsite.description}</CardText>
                            </CardBody>
                        </Card>
                   </FadeTransform> 
                 </div>)    
    }

function RenderComments({comments, addComment, campsiteId}) {
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>Comments</h4>
                <Stagger in>
                    {comments.map(comment=> {
                        return(
                            <Fade in key={comment.id}>
                                <div >
                                    <p>{comment.text}<br />
                                        {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                    </p>
                                </div>
                           </Fade> 
                        );
                    })}
                </Stagger>
                <CommentForm campsiteId={campsiteId} addComment={addComment} />
            </div>
        );
    }
    return <div />;
}

    
function CampsiteInfo(props) {
    if(props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        )
    }
    if (props.errMess) {
        return(
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }

    if (props.campsite){
        return (
            <div className="container">
                <div className="row">
                <div className="col">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to='/directory'>Directory</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <h2>{props.campsite.name}</h2>
                    <hr />
                </div>
            </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite}/>
                    <RenderComments 
                        comments={props.comments}
                        addComment={props.addComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        );
    }
    return (<div />);
}

const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);
const required = val => val && val.length;

class CommentForm extends Component {

     constructor(props) {
        super(props);

        this.state = {
            rating: '',
            author: '',
            text:'',
            touched: {
                author: false,
            },
            isModalOpen: false
        };
        
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }
    
    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
    }
    
    handleSubmit(values) {
        this.toggleModal();
        //When form is submitted, the add comment action creator will create an action using the values from this form.  Then that action will ge tdipsatched to the reducer which will update the state
        this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text)

    }


    render(){

        return (
            <React.Fragment>

                <Button outline onClick={this.toggleModal}>
                    <i className="fa-pencil  fa-lg" /> Submit Comment
                     </Button>

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <div className="col-md-10">
                            <LocalForm onSubmit={this.handleSubmit}>

                                <div className="form-group">
                                    <Label htmlFor="rating">Rating</Label>
                                    <Control.select className="form-control" model=".rating" id="rating" name="rating">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </Control.select>
                                </div>    
                                

                                <div className="form-group">
                                    <Label htmlFor="author">Your Name</Label>
                                    <Control.text className="form-control" model=".author" id="author" name="author"
                                        placeholder="Your Name"
                                        className = "form-control"
                                        validators = {{
                                            required,
                                            minLength: minLength(2),
                                            maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages= {{
                                            requried: 'Required',
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be less than 15 characters'
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                  <Label htmlFor="text">Comment</Label>
                                        <Control.textarea className="form-control" model=".text" id="text" name="text"/>
                                </div>
                                <Button type="submit" value="submit" color="primary">Submit</Button>
                            </LocalForm>
                        </div>
                    </ModalBody>

                </Modal>

          </React.Fragment>
        )
    }
}

export default CampsiteInfo;