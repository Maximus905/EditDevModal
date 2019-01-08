import React, {Component} from 'react'
import custCss from './style.module.css'
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'react-bootstrap'
import Office from '../components/Office'
import Region from '../components/Region'
import City from '../components/City'

class EditDevWindow extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: true,
            devId: null,
            office_id: null,
            city_id: null,
            region_id: null,
        };
    }
    cityFilter = {
        accessor: 'region_id',
        statement: '=',
        value: ''
    }
    officeFilter = {
        accessor: 'city_id',
        statement: '=',
        value: ''
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }
    onChangeRegion = ({selected}) => {
        console.log('onChangeRegion: ', selected)
        this.setState({region_id: selected})
    }
    onChangeCity = ({selected}) => {
        console.log('onChangeCity: ', selected)
        this.setState({city_id: selected})
    }
    onChangeOffice = ({selected}) => {
        console.log('onChangeOffice: ', selected)
        this.setState({office_id: selected})
    }

    updateCityFilter = () => {
        // return this.cityFilter.value === this.state.region_id ? this.cityFilter : Object.assign({}, this.cityFilter, {value: this.state.region_id})
        console.log(this.cityFilter.value === this.state.region_id ? 'old_city_filter' : 'new_city_filter')
    }

    updateOfficeFilter = () => {
        // return this.officeFilter.value === this.state.city_id ? this.officeFilter : Object.assign({}, this.officeFilter, {value: this.state.city_id})
        console.log(this.officeFilter.value === this.state.city_id ? 'old_office_filter' : 'new_office_filter')
    }

    render() {

        this.updateCityFilter()
        this.updateOfficeFilter()

        return (
            <Modal show={this.state.show} onHide={this.handleClose} bsSize="large" >
                <ModalHeader closeButton>
                    <Modal.Title>Modal heading. Device ID: {this.state.devId} </Modal.Title>
                </ModalHeader>
                <ModalBody className={custCss.modalBody} >
                    <Region onChange={this.onChangeRegion}/>
                    {/*<City onChange={this.onChangeCity}/>*/}
                    {/*<Office onChange={this.onChangeOffice}/>*/}
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
