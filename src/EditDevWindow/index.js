import React, {Component} from 'react'
import check from 'check-types'
import custCss from './style.module.css'
import axios from 'axios'
import {Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader, Checkbox} from 'react-bootstrap'
import Office from '../components/Office'
import Region from '../components/Region'
import City from '../components/City'
import DevType from '../components/DevType'
import Platform from '../components/Platform'
import Software from '../components/Software'
import Input from '../components/Base/Input'
import TextArea from '../components/Base/TextArea'
import Modules from '../components/Modules'
// import RemoteDataProvider from "../components/Base/RemoteDataProvider"

const DEV_DATA_URL = 'http://netcmdb-loc.rs.ru:8082/api/getDevData.json'

class EditDevWindow extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: true,
            devId: 11800,
            devDataLoading: false,
            devDataReady: false,

            region_id: null,
            city_id: null,
            office_id: null,
            devType_id: null,
            software_id: null,
            softwareVer: null,
            sn: null,
            altSn: null,
            hostname: null,
            mngIp: null,
            officeComment: null,
            deviceComment: null,
            devInUse: false
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
    handleSubmit() {

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
    onChangeDevType = ({selected}) => {
        console.log('onChangeDevType: ', selected)
        this.setState({devType_id: selected})
    }
    onChangeSoftware = ({selected}) => {
        console.log('onChangeDevType: ', selected)
        this.setState({software_id: selected})
    }
    onChangeSoftwareVer = ({value}) => {
        console.log('onChangeDevType: ', value)
        this.setState({softwareVer: value})
    }
    onChangeSn = ({value}) => {
        this.setState({sn: value})
    }
    onChangeAltSn = ({value}) => {
        this.setState({altSn: value})
    }
    onChangeHostname = ({value}) => {
        this.setState({hostname: value})
    }
    onChangeMngIp = ({value}) => {
        this.setState({mngIp: value})
    }
    onChangeOfficeComment = ({value}) => {
        this.setState({officeComment: value})
    }
    onChangeDeviceComment = ({value}) => {
        this.setState({deviceComment: value})
    }
    onChangeDevInUse = (e) => {
        this.setState({devInUse: e.target.checked})
    }

    loadDeviceData = async (id) => {
        try {
            const res = await axios.get(DEV_DATA_URL, {
                params: {id}
            })
            const {data: {devData}} = res
            // console.log('devData:', devData)
            return check.nonEmptyObject(devData) ? devData : {}
        } catch (e) {
            console.log('fetching data error:', e.toString())
            return {}
        }
    }

    memoizedCityFilter = ((prevFilter) => () => {
        console.log(prevFilter.region_id === this.state.region_id ? 'old_city_filter' : 'new_city_filter')
        if (prevFilter.region_id !== this.state.region_id) prevFilter = Object.assign({}, this.cityFilter, {region_id: this.state.region_id})
        return prevFilter
    })('')

    memoizedOfficeFilter = ((prevFilter) => () => {
        console.log(prevFilter.city_id === this.state.city_id ? 'old_city_filter' : 'new_city_filter')
        if (prevFilter.city_id !== this.state.city_id) prevFilter = Object.assign({}, this.officeFilter, {city_id: this.state.city_id})
        return prevFilter
    })('')

    render() {

        return (
            <Modal show={this.state.show} onHide={this.handleClose} bsSize="large" >
                <ModalHeader closeButton>
                    <Modal.Title>Modal heading. Device ID: {this.state.devId} </Modal.Title>
                </ModalHeader>
                <ModalBody className={custCss.modalBody} >
                    <Row>
                        <Col md={4}><Region onChange={this.onChangeRegion} selected={this.state.region_id}/></Col>
                        <Col md={4}><City onChange={this.onChangeCity} selected={this.state.city_id} filter={this.cityFilter}/></Col>
                        <Col md={4}><Office onChange={this.onChangeOffice}/></Col>
                    </Row>
                    <Row>
                        <Col md={3}><DevType onChange={this.onChangeDevType} /></Col>
                        <Col md={3}><Platform /></Col>
                        <Col md={3}><Software onChange={this.onChangeSoftware} /></Col>
                        <Col md={3}><Input controlId='swVer' onChange={this.onChangeSoftwareVer} defaultValue='по версия' label="Версия ПО"/></Col>
                    </Row>
                    <Row>
                        <Col md={3}><Input controlId='devSn' addOnPosition="left" addOnText="SN" onChange={this.onChangeSn} defaultValue='test' label=" " disabled/></Col>
                        <Col md={3}><Input controlId='devAltSn' addOnPosition="left" addOnText="alt SN" onChange={this.onChangeAltSn} label=" " /></Col>
                        <Col md={3}><Input controlId='hostname' addOnPosition="left" addOnText="hostname" onChange={this.onChangeHostname} label=" " /></Col>
                        <Col md={3}><Input controlId='managementIP' addOnPosition="left" addOnText="management IP" onChange={this.onChangeMngIp} label=" " defaultValue='255.255.255.255' /></Col>
                    </Row>
                    <Row>
                        <Col md={6}><TextArea controlId="officeComment" onChange={this.onChangeOfficeComment} defaultValue='officeComment' label="Комментарий к оффису" /></Col>
                        <Col md={6}><TextArea controlId="deviceComment" onChange={this.onChangeDeviceComment} defaultValue='deviceComment' label="Коментарий к устройству" /></Col>
                    </Row>
                    <Row><Col md={6}><Checkbox title="Устройство используется" onChange={this.onChangeDevInUse} checked={this.state.devInUse} >Устройство используется</Checkbox></Col></Row>
                    <Row>
                        <Col md={12}><Modules/></Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.handleClose} bsStyle="danger" >Отмена</Button>
                    <Button onClick={this.handleSubmit} bsStyle="success">Сохранить</Button>
                </ModalFooter>
            </Modal>
        )
    }
    async componentDidMount() {
        window.openEditModal = (id) => {
            this.setState({
                show: true,
                devId: 11800
                // devId: id
            })
        }
    }

    async componentDidUpdate() {
        const {devId, devDataReady, devDataLoading} = this.state
        if (devId && !devDataReady && !devDataLoading) {
            console.log('loading dev data')
            this.setState({devDataLoading: true})
            const devData = await this.loadDeviceData(this.state.devId)
            console.log(devData)
            const data = (({
                               region_id = '',
                               city_id = '',
                               office_id = '',
                               devType_id = '',
                               software_id = '',
                               softwareVer = '',
                               sn = '',
                               altSn = '',
                               hostname = '',
                               mngIp = '',
                               officeComment = '',
                               deviceComment = '',
                               devInUse = false
            }) => ({region_id, city_id, office_id, devType_id, software_id, softwareVer, sn, altSn, hostname, mngIp, officeComment, deviceComment, devInUse}))(devData)
            this.setState(Object.assign({}, {devDataLoading: false, devDataReady: true}, data))
        }
    }
}

export default EditDevWindow
