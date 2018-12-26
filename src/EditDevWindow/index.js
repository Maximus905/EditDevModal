import React, {Component} from 'react'
// import './App.css'
// import './style.module.css'
import custCss from './style.module.css'
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'react-bootstrap'
import Office from '../components/Office'
import Region from '../components/Region'

class EditDevWindow extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: true,
            devId: null,
            office: null,
        };
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose} bsSize="large" >
                <ModalHeader closeButton>
                    <Modal.Title>Modal heading. Device ID: {this.state.devId} </Modal.Title>
                </ModalHeader>
                <ModalBody className={custCss.modalBody} >
                    <Region/>
                    <Office/>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.handleClose}>Close</Button>
                </ModalFooter>
            </Modal>
        )
    }
    async componentDidMount() {
        window.openEditModal = (id) => {
            this.setState({
                show: true,
                devId: id
            })
        }
    }
}

export default EditDevWindow
