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
import Ports from '../components/Ports'
import Location from '../components/Location'
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
     * @typedef moduleInfo
     * @type {Object}
     * @property {string} module
     * @property {number} module_item_id
     * @property {Object} module_item_details
     * @property {string} module_item_sn
     * @property {boolean} module_in_use
     * @property {boolean} module_not_found

     *
     * @type {object} state
     * @property {boolean} show
     * @property {number} devId
     * @property {boolean} devDataLoading
     * @property {boolean} devDataReady
     * @property {object} locationInfo
     * @property {object} devInfo
     * @property {Array.<moduleInfo>} modulesInfo
     * @property {Array} portsInfo
     *
     */
    state = {
        show: true,
        // devId: 12137,
        devId: 1506,
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
        modulesInfo: [],
        /**
         * @type {{'port_id', 'port_ip', 'port_comment',
         * 'port_details', 'port_is_mng', 'port_mac', 'port_mask_len'}}
         */
        portsInfo: []
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
         * 'module_item_comment', 'module_item_sn', 'module_in_use', 'module_not_found'}}
         */
        modulesInfo: [],
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
        const {locationInfo} = this.state
        this.setState({locationInfo: Object.assign({}, locationInfo, {region_id: selected})})
    }
    onChangeCity = ({selected}) => {
        const {locationInfo} = this.state
        this.setState({locationInfo: Object.assign({}, locationInfo, {city_id: selected})})
    }
    onChangeOffice = ({selected}) => {
        const {locationInfo} = this.state
        this.setState({locationInfo: Object.assign({}, locationInfo, {office_id: selected})})
    }
    onChangeDevType = ({selected}) => {
        const {devInfo} = this.state
        this.setState({devInfo: Object.assign({}, devInfo, {devType_id: selected})})
    }
    onChangeSoftware = ({selected}) => {
        const {devInfo} = this.state
        this.setState({devInfo: Object.assign({}, devInfo, {software_id: selected})})
    }
    onChangeSoftwareVer = ({value}) => {
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
        const {devInfo} = this.state
        this.setState({devInfo: Object.assign({}, devInfo, {dev_in_use: e.target.checked})})
    }
    onChangeModuleComment = (idx) => ({value}) => {
        const {modulesInfo} = this.state
        if (modulesInfo[idx] && modulesInfo[idx].module_item_comment !== value) {
            modulesInfo[idx].module_item_comment = value
            this.setState({modulesInfo})
        }

    }
    onChangeModuleInUseStatus = (idx) => ({value}) => {
        const {modulesInfo} = this.state
        if (modulesInfo[idx] && modulesInfo[idx].module_in_use !== value) {
            modulesInfo[idx].module_in_use = value
            this.setState({modulesInfo})
        }

    }
    onChangeIsMngCheckBox = (idx) => (state) => {
        const {value} = state
        if (value === undefined) return
        const {portsInfo} = this.state
        if (portsInfo[idx] && portsInfo[idx].port_is_mng !== value) {
            portsInfo[idx].port_is_mng = value
            this.setState({portsInfo})
        }

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
        // console.log(prevFilter.region_id === this.state.region_id ? 'old_city_filter' : 'new_city_filter')
        if (prevFilter.region_id !== this.state.region_id) prevFilter = Object.assign({}, this.cityFilter, {region_id: this.state.region_id})
        return prevFilter
    })('')

    memoizedOfficeFilter = ((prevFilter) => () => {
        // console.log(prevFilter.city_id === this.state.city_id ? 'old_city_filter' : 'new_city_filter')
        if (prevFilter.city_id !== this.state.city_id) prevFilter = Object.assign({}, this.officeFilter, {city_id: this.state.city_id})
        return prevFilter
    })('')

    render() {
        const {devInfo, modulesInfo, portsInfo, mngIp} = this.initialData
        console.log('4444444444', devInfo.dev_details)
        const {site = {}} = devInfo && devInfo.dev_details ? devInfo.dev_details : {}
        console.log('5555555', site)

        return (
            <Modal show={this.state.show} onHide={this.handleClose} bsSize="large" >
                <ModalHeader closeButton>
                    <Modal.Title>Modal heading. Device ID: {this.state.devId} </Modal.Title>
                </ModalHeader>
                <ModalBody className={custCss.modalBody} >
                    <Row>
                        <Col md={2}><Region onChange={this.onChangeRegion} selected={this.state.locationInfo.region_id}/></Col>
                        <Col md={2}><City onChange={this.onChangeCity} selected={this.state.locationInfo.city_id} filter={this.cityFilter}/></Col>
                        <Col md={4}><Office onChange={this.onChangeOffice} defaultSelected={devInfo.location_id} /></Col>
                        <Col md={4}><TextArea controlId="officeComment" onChange={this.onChangeOfficeComment} placeholder='Комментарий к офису' defaultValue='' label="Комментарий к оффису" /></Col>
                    </Row>
                    <Row>
                        <Col md={3}><DevType onChange={this.onChangeDevType} defaultSelected={devInfo.dev_type_id} /></Col>
                        <Col md={3}><Platform defaultSelected={devInfo.platform_id}/></Col>
                        <Col md={3}><Software onChange={this.onChangeSoftware}  defaultSelected={devInfo.software_id} /></Col>
                        <Col md={3}><Input controlId='swVer' onChange={this.onChangeSoftwareVer} defaultValue={devInfo.software_ver} label="Версия ПО"/></Col>
                    </Row>
                    <Row>
                        <Col md={3}><Input controlId='devSn' addOnPosition="left" addOnText="SN" onChange={this.onChangeSn} defaultValue={devInfo.platform_sn} label=" " disabled/></Col>
                        <Col md={3}><Input controlId='devAltSn' addOnPosition="left" addOnText="alt SN" onChange={this.onChangeAltSn} defaultValue={devInfo.platform_sn_alt} label=" " /></Col>
                        <Col md={3}><Input controlId='hostname' addOnPosition="left" addOnText="hostname" onChange={this.onChangeHostname} defaultValue={devInfo.dev_details && devInfo.dev_details.hostname} label=" " /></Col>
                        <Col md={3}><Input controlId='managementIP' addOnPosition="left" addOnText="management IP" onChange={this.onChangeMngIp} label=" " defaultValue={mngIp} /></Col>
                    </Row>
                    <Row>

                        <Col md={6}><TextArea controlId="deviceComment" onChange={this.onChangeDeviceComment} placeholder='Комментарий к устройству' defaultValue={devInfo.dev_comment} label="Коментарий к устройству" /></Col>
                    </Row>
                    <Row><Col md={6}><Checkbox title="Устройство используется" onChange={this.onChangeDevInUse} checked={this.state.devInfo.dev_in_use || false} >Устройство используется</Checkbox></Col></Row>
                    <Row>
                        <Col md={10}><Modules data={modulesInfo} onChange={this.onChangeModuleComment} onChangeInUseStatus={this.onChangeModuleInUseStatus} /></Col>
                        <Col md={12}><Ports data={portsInfo} onChangeIsMng={this.onChangeIsMngCheckBox} /></Col>
                    </Row>
                    <Row>
                        <Col md={10}>
                            <Location data={site} />
                        </Col>
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
            const {devId} = this.state
            this.setState({devDataLoading: true})
            // const devData = await this.fetchDeviceData(this.state.devId)
            const response = await Promise.all([
                this.fetchDeviceData(devId),
                this.fetchDevModulesData(devId),
                this.fetchDevPortsData(devId)
            ])
            const [{devInfo}, {modulesInfo}, {portsInfo}] = response
            this.initialData = {devInfo, modulesInfo, portsInfo, mngIp: this.managementIp(portsInfo)}
            this.setState(Object.assign({}, {devDataLoading: false, devDataReady: true}, {devInfo, modulesInfo, portsInfo}))
        }
    }
}

export default EditDevWindow
