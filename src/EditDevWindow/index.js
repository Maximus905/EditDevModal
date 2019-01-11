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
const DEV_MODULES_DATA_URL = 'http://netcmdb-loc.rs.ru:8082/api/getDevModulesData.json'
const DEV_PORTS_DATA_URL = 'http://netcmdb-loc.rs.ru:8082/api/getDevPortsData.json'


class EditDevWindow extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);


    }
    /**
     *
     * @type {object} state
     * @property {boolean} show
     * @property {number} devId
     * @property {boolean} devDataLoading
     * @property {boolean} devDataReady
     * @property {object} locationInfo
     * @property {object} devInfo
     * @property {object} modulesInfo
     * @property {object} portsInfo
     *
     */
    state = {
        show: true,
        devId: 11800,
        // devDataLoading: false,
        devDataReady: false,
        /**
         * @type {{region_id, city_id, office_id}}
         */
        locationInfo: {
            region_id: '',
            city_id: '',
            office_id: ''
        },
        /**
         * @type {{dev_id, location_id, platform_id, platform_item_id,
         * 'software_id', 'software_item_id', 'vendor_id', 'dev_type_id',
         * 'dev_comment', 'software_comment', 'dev_last_update', 'dev_in_use',
         * 'platform_sn', 'platform_sn_alt', 'is_hw', 'software_ver', 'dev_details',
         * 'software_details'}} devInfo
         */
        devInfo: {},
        /**
         * @type {{'module' ,'module_item_id', 'module_item_details',
         * 'module_item_sn', 'module_in_use', 'module_not_found'}}
         */
        modulesInfo: {},
        /**
         * @type {{'port_id', 'port_ip', 'port_comment',
         * 'port_details', 'port_is_mng', 'port_mac', 'port_mask_len'}}
         */
        portsInfo: {}
    };
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

    initialData = {
        /**
         * @type {{dev_id, location_id, platform_id, platform_item_id,
         * 'software_id', 'software_item_id', 'vendor_id', 'dev_type_id',
         * 'dev_comment', 'software_comment', 'dev_last_update', 'dev_in_use',
         * 'platform_sn', 'platform_sn_alt', 'is_hw', 'software_ver', 'dev_details',
         * 'software_details'}} devInfo
         */
        devInfo: {},
        /**
         * @type {{'module' ,'module_item_id', 'module_item_details',
         * 'module_item_sn', 'module_in_use', 'module_not_found'}}
         */
        modulesInfo: {},
        /**
         * @type {{'port_id', 'port_ip', 'port_comment',
         * 'port_details', 'port_is_mng', 'port_mac', 'port_mask_len'}}
         */
        portsInfo: [],
        /**
         * @type {string} mngIp
         */
        mngIp: ''
    }
    managementIp = (portsInfo) => {
        if (!check.array(portsInfo)) return
        const res = portsInfo.filter((port) => port.port_is_mng).map((port) => port.port_ip)
        return res.join(', ')
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
        const {locationInfo} = this.state
        this.setState({locationInfo: Object.assign({}, locationInfo, {region_id: selected})})
    }
    onChangeCity = ({selected}) => {
        console.log('onChangeCity: ', selected)
        const {locationInfo} = this.state
        this.setState({locationInfo: Object.assign({}, locationInfo, {city_id: selected})})
    }
    onChangeOffice = ({selected}) => {
        console.log('onChangeOffice: ', selected)
        const {locationInfo} = this.state
        this.setState({locationInfo: Object.assign({}, locationInfo, {office_id: selected})})
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

    fetchDeviceData = async (id) => {
        try {
            const res = await axios.get(DEV_DATA_URL, {
                params: {id}
            })
            const {data} = res
            if (!data.devInfo) {
                console.log('ERROR: fetchDeviceData')
                return {}
            }
            return data
        } catch (e) {
            console.log('ERROR: fetchDeviceData', e.toString())
            return {}
        }
    }
    fetchDevModulesData = async (id) => {
        try {
            const res = await axios.get(DEV_MODULES_DATA_URL, {
                params: {id}
            })
            const {data} = res
            // console.log('modData:', modData)
            if (!data.modulesInfo) {
                console.log('ERROR: fetchDevModulesData')
                return []
            }
            return data
        } catch (e) {
            console.log('ERROR: fetchDevModulesData', e.toString())
            return []
        }
    }
    fetchDevPortsData = async (id) => {
        try {
            const res = await axios.get(DEV_PORTS_DATA_URL, {
                params: {id}
            })
            const {data} = res
            if (!data.portsInfo) {
                console.log('ERROR: fetchDevPortsData')
                return []
            }
            return data
        } catch (e) {
            console.log('ERROR: fetchDevPortsData', e.toString())
            return []
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
        const {devInfo, modulesInfo, portsInfo, mngIp} = this.initialData
        return (
            <Modal show={this.state.show} onHide={this.handleClose} bsSize="large" >
                <ModalHeader closeButton>
                    <Modal.Title>Modal heading. Device ID: {this.state.devId} </Modal.Title>
                </ModalHeader>
                <ModalBody className={custCss.modalBody} >
                    <Row>
                        <Col md={4}><Region onChange={this.onChangeRegion} selected={this.state.locationInfo.region_id}/></Col>
                        <Col md={4}><City onChange={this.onChangeCity} selected={this.state.locationInfo.city_id} filter={this.cityFilter}/></Col>
                        <Col md={4}><Office onChange={this.onChangeOffice}/></Col>
                    </Row>
                    <Row>
                        <Col md={3}><DevType onChange={this.onChangeDevType} /></Col>
                        <Col md={3}><Platform /></Col>
                        <Col md={3}><Software onChange={this.onChangeSoftware} /></Col>
                        <Col md={3}><Input controlId='swVer' onChange={this.onChangeSoftwareVer} defaultValue='по версия' label="Версия ПО"/></Col>
                    </Row>
                    <Row>
                        <Col md={3}><Input controlId='devSn' addOnPosition="left" addOnText="SN" onChange={this.onChangeSn} defaultValue={devInfo.platform_sn} label=" " disabled/></Col>
                        <Col md={3}><Input controlId='devAltSn' addOnPosition="left" addOnText="alt SN" onChange={this.onChangeAltSn} defaultValue={devInfo.platform_sn_alt} label=" " /></Col>
                        <Col md={3}><Input controlId='hostname' addOnPosition="left" addOnText="hostname" onChange={this.onChangeHostname} defaultValue={devInfo.dev_details && devInfo.dev_details.hostname} label=" " /></Col>
                        <Col md={3}><Input controlId='managementIP' addOnPosition="left" addOnText="management IP" onChange={this.onChangeMngIp} label=" " defaultValue={mngIp} /></Col>
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
            const {devId} = this.state
            this.setState({devDataLoading: true})
            // const devData = await this.fetchDeviceData(this.state.devId)
            const response = await Promise.all([
                this.fetchDeviceData(devId),
                this.fetchDevModulesData(devId),
                this.fetchDevPortsData(devId)
            ])
            const [{devInfo}, {modulesInfo}, {portsInfo}] = response
            console.log('devData:',devInfo, modulesInfo, portsInfo)
            this.initialData = {devInfo, modulesInfo, portsInfo, mngIp: this.managementIp(portsInfo)}
            console.log('22222', this.initialData)
            this.setState(Object.assign({}, {devDataLoading: false, devDataReady: true}, {devInfo, modulesInfo, portsInfo}))
        }
    }
}

export default EditDevWindow
