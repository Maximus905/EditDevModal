import React, {Component} from 'react'
import check from 'check-types'
import custCss from './style.module.css'
import axios from 'axios'
import equal from 'fast-deep-equal'
import {Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader, Checkbox} from 'react-bootstrap'
import Office from '../components/Office'
import Region from '../components/Region'
import City from '../components/City'
import DevType from '../components/DevType'
import Platform from '../components/Platform'
import Software from '../components/Software'
import Input from '../components/Base/Input'
import TextArea from '../components/Base/TextArea'
import CheckBox from '../components/Base/CheckBox'
import Modules from '../components/Modules'
import Ports from '../components/Ports'
import DevLocation from '../components/DevLocation'
// import RemoteDataProvider from "../components/Base/RemoteDataProvider"

const DEV_DATA_URL = 'http://netcmdb-loc.rs.ru:8082/api/getDevData.json'
const DEV_MODULES_DATA_URL = 'http://netcmdb-loc.rs.ru:8082/api/getDevModulesData.json'
const DEV_PORTS_DATA_URL = 'http://netcmdb-loc.rs.ru:8082/api/getDevPortsData.json'
const DEV_LOCATION_URL = 'http://netcmdb-loc.rs.ru:8082/api/getDevLocation.json'


class EditDevWindow extends Component {
    constructor(props, context) {
        super(props, context);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);


    }
     /**
      * @typedef {{
      *      floor: (number|string),
      *      row: (number|string),
      *      rack: (number|string),
      *      unit: (number|string),
      *      rackSide: string
      * }} Site
      *
      * @typedef {{
      *      hostname: string,
      *      site: Site
      * }} DevDetails
      *
      * @typedef {{
      *     dev_id: number,
      *     location_id: number,
      *     platform_id: number,
      *     platform_item_id: number,
      *     software_id: number,
      *     software_item_id: number,
      *     vendor_id: number,
      *     dev_type_id: number,
      *     dev_comment: string,
      *     software_comment: string,
      *     dev_last_update: string,
      *     dev_in_use: boolean,
      *     platform_sn: string,
      *     platform_sn_alt: string,
      *     is_hw: boolean,
      *     software_ver: string,
      *     dev_details: (Dev_details|object),
      *     software_details: object
      * }} DevInfo
      *
      * @typedef {{
      *     module: string
      *     module_item_id: number,
      *     module_item_details: object,
      *     module_item_sn: string,
      *     module_in_use: boolean,
      *     module_not_found: boolean
      * }} Module
      *
      * @typedef {{
      *     port_id: number,
      *     port_ip,
      *     port_comment,
      *     port_details,
      *     port_is_mng,
      *     port_mac,
      *     port_mask_len
      * }} Port
      *
      * @typedef {{
      *     region_id: number,
      *     city_id: number,
      *     office_id: number
      *     office_comment
      * }} GeoLocation
      *
      * @typedef {{
      *     accessor: string,
      *     statement: string,
      *     value: (string|number)
      * }} Filter
      */

      /**
      * @type {{
      *     show: boolean,
      *     devId: (number|string),
      *     devDataLoading: boolean,
      *     devDataReady: boolean,
       *     mngPorts: array
      * }} state
      */
    state = {
        show: false,
        devId: '',
        devDataLoading: false,
        devDataReady: false,
        mngPorts: []
    }
    /**
     * @type {{
     *    geoLocation: (GeoLocation|object),
     *     devInfo: (DevInfo|object),
     *     modules: (Module[]|Array),
     *     ports: (Port[]|Array)
     * }} initialData
     */
    initialData = {
        geoLocation: {},
        devInfo: {},
        modules: [],
        ports: [],
    }

    /**
     * @type {{
     *     geoLocation: (GeoLocation|object),
     *     devInfo: (DevInfo|object),
     *     modules: (Module[]|Array),
     *     ports: (Port[]|Array),
     * }} currentState
     */
    currentState = {
        geoLocation: {},
        devInfo: {},
        modules: [],
        ports: [],
    }
    /**
     * @type Filter cityFilter
     */
    cityFilter = {
        accessor: 'region_id',
        statement: '=',
        value: ''
    }
    /**
     * @type Filter officeFilter
     */
    officeFilter = {
        accessor: 'city_id',
        statement: '=',
        value: ''
    }

    managingIp = (portsInfo) => {
        console.log('mngIP==========', portsInfo)
        if (!check.array(portsInfo)) return
        const res = portsInfo.filter((port) => port.port_is_mng).map((port) => port.port_ip)
        return res.join(', ')
    }
    managingPortsIdx = (portsInfo) => {
        if (!check.array(portsInfo)) return
        return portsInfo.filter((port) => port.port_is_mng).map((port) => port.port_id)
    }

    handleClose() {
        this.setState({ show: false });
    }
    handleSubmit() {

    }

    handleShow() {
        this.setState({ show: true });
    }

    onChangeGeoLocation = (key) => ({value}) => {
        const {geoLocation} = this.currentState
        geoLocation[key] = value
        // console.log('geolocation', geoLocation)
    }
    onChangeDevInfo = (key) => ({value}) => {
        const {devInfo, geoLocation} = this.currentState
        devInfo[key] = value
        if (key === 'location_id') this.onChangeGeoLocation('office_id')({value})
        // console.log('DevInfo', devInfo, geoLocation)
    }
    onChangeDevDetails = (key) => ({value}) => {
        const {devInfo, geoLocation} = this.currentState
        if (! devInfo.dev_details) devInfo.dev_details = {}
        devInfo.dev_details[key] = value
    }
    onChangeMngIp = ({value}) => {
        // this.setState({mngIp: value})
    }
    onChangeModule = (key) => (idx) => ({value}) => {
        const {modules} = this.currentState
        if (modules[idx] && modules[idx][key] !== value) {
            modules[idx][key] = value
        }
        // console.log('Modules', modules)
    }
    onChangePorts = ({ports}) => {
        if (check.not.nonEmptyArray(ports)) return
        const {ports: currentPorts} = this.currentState
        const updatedPorts = currentPorts.map((port, index) => {
            return {...port, port_is_mng: ports[index].port_is_mng}
        })
        this.currentState.ports = updatedPorts
        console.log('Ports', this.currentState.ports)
    }
    onChangeDevLocation = (key) => ({value}) => {
        if (value === undefined) return
        // const {devInfo, devInfo: {dev_details = {}}} = this.state
        // if (!devInfo.dev_details)  devInfo.dev_details = {}
        // const {site = {}} = devInfo.dev_details
        // const newSite = Object.assign({}, site, {[key]: value})
        // devInfo.dev_details.site = newSite
        // const newDevDetails = Object.assign({}, dev_details, {site: newSite})
        // console.log('changeLoc ',key, devInfo, newDevDetails.site)
        // this.setState({devInfo: Object.assign({}, devInfo)})
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
            if (!data.modules) {
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
            if (!data.ports) {
                console.log('ERROR: fetchDevPortsData')
                return []
            }
            return data
        } catch (e) {
            console.log('ERROR: fetchDevPortsData', e.toString())
            return []
        }
    }
    getDevLocation = async (location_id) => {
        try {
            const res = await axios.get(DEV_LOCATION_URL, {
                params: {location_id}
            })
            const {data} = res
            if (!data.location) {
                console.log('ERROR: fetchDevLocation')
                return []
            }
            return data
        } catch (e) {
            console.log('ERROR: fetchDevLocation', e.toString())
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
        const {geoLocation, devInfo, modules, ports} = this.initialData
        const mngIp = this.managingIp(ports)
        const devSite = (() => {
            const {floor, row, rack, unit, rackSide} = devInfo && devInfo.dev_details && devInfo.dev_details.site ? devInfo.dev_details.site : {}
            return {floor, row, rack, unit, rackSide}
        })()
        console.log('EditDevWindow render', this.initialData.devInfo, 'ready', this.state.devDataReady, 'loading', this.state.devDataLoading, this.state.show, this.state.devId, 'defSelected', geoLocation.region_id)

        return (
            <Modal show={this.state.show} onHide={this.handleClose} bsSize="large" >
                <ModalHeader closeButton>
                    <Modal.Title>Modal heading. Device ID: {this.state.devId} </Modal.Title>
                </ModalHeader>
                <ModalBody className={custCss.modalBody} >
                    <Row>
                        <Col md={2}><Region onChange={this.onChangeGeoLocation} defaultSelected={geoLocation.region_id}/></Col>
                        <Col md={2}><City onChange={this.onChangeGeoLocation} defaultSelected={geoLocation.city_id} filter={this.cityFilter}/></Col>
                        <Col md={4}><Office onChange={this.onChangeDevInfo} defaultSelected={devInfo.location_id} /></Col>
                        <Col md={4}><TextArea controlId="officeComment" onChange={this.onChangeGeoLocation('office_comment')} placeholder='Комментарий к офису' defaultValue={geoLocation.office_comment} label="Комментарий к оффису" /></Col>
                    </Row>
                    <Row>
                        <Col md={3}><DevType onChange={this.onChangeDevInfo} defaultSelected={devInfo.dev_type_id} /></Col>
                        <Col md={3}><Platform defaultSelected={devInfo.platform_id}/></Col>
                        <Col md={3}><Software onChange={this.onChangeDevInfo}  defaultSelected={devInfo.software_id} /></Col>
                        <Col md={3}><Input controlId='swVer' onChange={this.onChangeDevInfo('software_ver')} defaultValue={devInfo.software_ver} label="Версия ПО"/></Col>
                    </Row>
                    <Row>
                        <Col md={3}><Input controlId='devSn' addOnPosition="left" addOnText="SN" onChange={this.onChangeDevInfo('platform_sn')} defaultValue={devInfo.platform_sn} label=" " disabled/></Col>
                        <Col md={3}><Input controlId='devAltSn' addOnPosition="left" addOnText="alt SN" onChange={this.onChangeDevInfo('platform_sn_alt')} defaultValue={devInfo.platform_sn_alt} label=" " /></Col>
                        <Col md={3}><Input controlId='hostname' addOnPosition="left" addOnText="hostname" onChange={this.onChangeDevDetails('hostname')} defaultValue={devInfo.dev_details && devInfo.dev_details.hostname} label=" " /></Col>
                        <Col md={3}><Input controlId='managementIP' addOnPosition="left" addOnText="management IP" onChange={this.onChangeMngIp} label=" " defaultValue={mngIp} /></Col>
                    </Row>
                    <Row>
                        <Col md={6}><TextArea controlId="deviceComment" onChange={this.onChangeDevInfo('dev_comment')} placeholder='Комментарий к устройству' defaultValue={devInfo.dev_comment} label="Коментарий к устройству" /></Col>
                    </Row>
                    <Row><Col md={6}><CheckBox title="Устройство используется" onChange={this.onChangeDevInfo('dev_in_use')} checked={devInfo.dev_in_use} >Устройство используется</CheckBox></Col></Row>
                    <Row>
                        <Col md={10}><Modules data={modules} onChange={this.onChangeModule} /></Col>
                        <Col md={12}><Ports data={ports} onChange={this.onChangePorts} /></Col>
                    </Row>
                    <Row>
                        <Col md={10}>
                            <DevLocation {...devSite} onChange={this.onChangeDevLocation} />
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
        window.openEditModal = ((id) => {
            this.setState({
                show: true,
                devId: id
            })
        })(1506)
    }

    async componentDidUpdate() {
        const {devId, devDataReady, devDataLoading} = this.state
        if (devId && !devDataReady && !devDataLoading) {
            this.setState({devDataLoading: true})
            // const devData = await this.fetchDeviceData(this.state.devId)
            try {
                const response1 = await Promise.all([
                    this.fetchDeviceData(devId),
                    this.fetchDevModulesData(devId),
                    this.fetchDevPortsData(devId)
                ])
                const [{devInfo}, {modules}, {ports}] = response1
                let geoLocation = {}
                if (devInfo && devInfo.location_id) {
                    const response2 = await this.getDevLocation(devInfo.location_id)
                    const {location = {}} = response2
                    const {location_id: office_id, city_id, region_id, office_comment} = location
                    geoLocation = {office_id, city_id, region_id, office_comment}
                    console.log('==========================', geoLocation)
                }
                this.initialData = {...this.initialData, devInfo, modules, ports, geoLocation}
                this.currentState = {
                    geoLocation: JSON.parse(JSON.stringify(geoLocation)),
                    devInfo: JSON.parse(JSON.stringify(devInfo)),
                    modules: JSON.parse(JSON.stringify(modules)),
                    ports: JSON.parse(JSON.stringify(ports)),
                }
                console.log('didUpdate', this.initialData)
                this.setState({devDataLoading: false, devDataReady: true})
            } catch (e) {
                console.log('Loading dev data ERROR', e.toString())
            }

        }
    }
}

export default EditDevWindow
