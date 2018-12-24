import React, {Component} from 'react'
// import './App.css'
// import './style.module.css'
import custCss from './style.module.css'
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'react-bootstrap'
import Select from '../components/Select'


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
        const optionList = [
            {value: 1, title: 't1'},
            {value: 3, title: 't3'},
            {value: 4, title: 't3'},
        ]
        return (
            <Modal show={this.state.show} onHide={this.handleClose} bsSize="large" >
                <ModalHeader closeButton>
                    <Modal.Title>Modal heading. Device ID: {this.state.devId} </Modal.Title>
                </ModalHeader>
                <ModalBody className={custCss.modalBody} >
                    <Select optionList={optionList} isAsync selected={8} />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.handleClose}>Close</Button>
                </ModalFooter>
            </Modal>
        )
    }
    componentDidMount() {
        window.openEditModal = (id) => {
            this.setState({
                show: true,
                devId: id
            })
        }
    }
}

export default EditDevWindow
