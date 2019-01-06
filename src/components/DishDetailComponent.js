import React,{Component} from 'react';
import {Card,CardImg,CardBody,CardTitle,CardText,Breadcrumb,BreadcrumbItem,Button,
        Modal,ModalBody,ModalHeader,Label,Row} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Control,LocalForm,Errors} from 'react-redux-form';
import {Loading} from './LoadingComponent';
import {baseUrl} from '../shared/baseUrl';
import {FadeTransform,Fade,Stagger} from 'react-animation-components';

    function RenderDish({dish}){
        return (
            
                <FadeTransform in
                    transfromProps = {{
                        exitTransform: 'scale(0.5) translateY(-50%)'
                    }}
                 >
                    <Card>
                        <CardImg width="100%" src = {baseUrl + dish.image} alt = {dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            
        );
    }

   function RenderComments({comments,postComment,dishId}){
        var commentList = comments.map(comment =>{
            return(
                <Fade key = {comment.id} in>
                    <li key = {comment.id}>
                        {comment.comment}
                        <br /><br />
                        -- {comment.author}&nbsp;&nbsp;{new Intl.DateTimeFormat('en-US',{year:'numeric',month:'short',day:'2-digit'}).format(new Date(Date.parse(comment.date)))}
                        <br /><br />
                    </li>
                </Fade>
            )
        });
        return(
            <div>
                <h4>Comments</h4>
                    <ul className = "list-unstyled">
                        <Stagger in>
                            {commentList}
                        </Stagger>
                    </ul>
                <CommentForm dishId = {dishId} postComment = {postComment} />
            </div>
        );
    }
    
    const DishDetail = (props) => {
        if(props.isLoading){
            return (
                <div className = "container">
                    <div className = "row">
                        <Loading />
                    </div>
                </div>
            );
        }else if(props.errMess){
            return (
                <div className = "container">
                    <div className = "row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if(props.dish != null){
            return(
                <div className = "container">
                    <div className = "row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to = '/menu'>Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className = "col-12">
                            <h3>{props.dish.name}</h3>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-5 m-1">
                            <RenderDish dish = {props.dish} />
                        </div>
                        <div className="col-12 col-md-5 m-1">
                            <RenderComments comments = {props.comments}
                                postComment = {props.postComment}
                                dishId = {props.dish.id} />
                        </div>
                    </div>
                </div>
            );
        }else{
            return(
                <div></div>
            );
        }
    }

export default DishDetail;

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && val.length >= len;
export class CommentForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            isModalOpen:false
        }
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    toggleModal(){
        this.setState({
            isModalOpen:!this.state.isModalOpen
        })
    }
    handleSubmit(values){
        this.toggleModal();
        this.props.postComment(this.props.dishId,values.rating,values.author,values.comment)
    }
    render(){
        return(
            <div>
                <Button outline onClick = {this.toggleModal}>
                <span className = "fa fa-pencil fa-lg"></span>Submit Comment   
                </Button>
                <div className = "row row-content">
                    <Modal isOpen = {this.state.isModalOpen} toggle = {this.state.toggleModal}>
                        <ModalHeader toggle = {this.toggleModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                            <LocalForm onSubmit = {(values) =>this.handleSubmit(values)}>
                                <Row>
                                        <Label>Rating</Label>
                                </Row>
                                <Row>
                                    <Control.select model = ".rating"  name = "rating" 
                                        className = "form-control" defaultValue = "1"
                                    >
                                        
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Row>
                                <Row>
                                    <Label htmlFor = "author" >Your Name</Label>
                                </Row>
                                <Row >
                                    <Control.text model = ".author" id = "author" name = "author"
                                        className = "form-control"
                                        validators = {{
                                            required,maxLength:maxLength(15),minLength:minLength(3)
                                        }}
                                    />
                                    <Errors 
                                        className = "text-danger"
                                        show = "touched"
                                        model = ".author"
                                        messages = {{
                                            required:'Required  ',
                                            maxLength: 'Must be 15 characters or less  ',
                                            minLength: 'Must greater than 2 characters  '
                                        }}
                                    />
                                </Row>
                                <Row >
                                    <Label htmlFor = "comment">Comment</Label>
                                </Row>
                                <Row >
                                    <Control.textarea model = ".comment" id = "comment" name="comment"
                                        row = "20"
                                        className = "form-control"
                                    />
                                </Row>
                                <Row>
                                    <Button type = "submit" color="primary">
                                        Submit
                                    </Button>
                                </Row>
                            </LocalForm>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }
}