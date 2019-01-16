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
      *     dev_details: Dev_details,
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
      * }} state
      *
      * @type {{
      *     geoLocation: (GeoLocation|object),
      *     devInfo: (DevInfo|object),
      *     modules: (Module[]|Array),
      *     ports: (Port[]|Array),
      *     mngIp: string
      *
      * }} currentState
      * @type Filter cityFilter
      * @type Filter officeFilter
      * @type {{
       *    geoLocation: (GeoLocation|object),
      *     devInfo: (DevInfo|object),
      *     modulesInfo: (Module[]|Array),
      *     portsInfo: (Port[]|Array)
      * }} initialData
      */
    state = {
        show: false,
        devId: '',
        devDataLoading: false,
        devDataReady: false,
        // locationInfo: {
        //     region_id: '',
        //     city_id: '',
        //     office_id: ''
        // },
        // devInfo: {},
        // modulesInfo: [],
        // portsInfo: [],
        // mngIp: ''
    };
    initialData = {
        geoLocation: {},
        devInfo: {},
        modulesInfo: [],
        portsInfo: [],
    }
    currentState = {
        geoLocation: {},
        devInfo: {},
        modules: [],
        ports: [],
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

    managingIp = (portsInfo) => {
        if (!check.array(portsInfo)) return
        const res = portsInfo.filter((port) => port.port_is_mng).map((port) => port.port_ip)
        return res.join(', ')
    }
    managingIpIdx = (portsInfo) => {
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
        console.log('geolocation', geoLocation)
    }
    onChangeDevInfo = (key) => ({value}) => {
        const {devInfo} = this.currentState
        devInfo[key] = value
    }

    onChangeRegion = ({value}) => {
        const {locationInfo} = this.state
        this.setState({locationInfo: Object.assign({}, locationInfo, {region_id: value})})
    }
    onChangeCity = ({value}) => {
        const {locationInfo} = this.state
        this.setState({locationInfo: Object.assign({}, locationInfo, {city_id: value})})
    }
    onChangeOffice = ({value}) => {
        const {locationInfo} = this.state
        this.setState({locationInfo: Object.assign({}, locationInfo, {office_id: value})})
    }
    onChangeDevType = ({value}) => {
        const {devInfo} = this.state
        this.setState({devInfo: Object.assign({}, devInfo, {devType_id: value})})
    }
    onChangeSoftware = ({value}) => {
        const {devInfo} = this.state
        this.setState({devInfo: Object.assign({}, devInfo, {software_id: value})})
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
    onChangeDevInUse = ({value}) => {
        const {devInfo} = this.state
        this.setState({devInfo: Object.assign({}, devInfo, {dev_in_use: value})})
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
    onChangeDevLocation = (key) => ({value}) => {
        if (value === undefined) return
        const {devInfo, devInfo: {dev_details = {}}} = this.state
        if (!devInfo.dev_details)  devInfo.dev_details = {}
        const {site = {}} = devInfo.dev_details
        const newSite = Object.assign({}, site, {[key]: value})
        devInfo.dev_details.site = newSite
        const newDevDetails = Object.assign({}, dev_details, {site: newSite})
        console.log('changeLoc ',key, devInfo, newDevDetails.site)
        this.setState({devInfo: Object.assign({}, devInfo)})
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
        const {geoLocation, devInfo, modulesInfo, portsInfo, mngIp} = this.initialData
        const devLocation = (() => {
            const {floor, row, rack, unit, rackSide} = devInfo && devInfo.dev_details && devInfo.dev_details.site ? devInfo.dev_details.site : {}
            return {floor, row, rack, unit, rackSide}
        })()
        console.log('EditDevWindow render', this.initialData.devInfo, 'ready', this.state.devDataReady, 'loading', this.state.devDataLoading, this.state.show, this.state.devId)

        return (
            <Modal show={this.state.show} onHide={this.handleClose} bsSize="large" >
                <ModalHeader closeButton>
                    <Modal.Title>Modal heading. Device ID: {this.state.devId} </Modal.Title>
                </ModalHeader>
                <ModalBody className={custCss.modalBody} >
                    {/*<Row>*/}
                        {/*<Col md={2}><Region onChange={this.onChangeGeoLocation('region_id')} selected={geoLocation.region_id}/></Col>*/}
                        {/*<Col md={2}><City onChange={this.onChangeGeoLocation('city_id')} selected={geoLocation.locationInfo.city_id} filter={this.cityFilter}/></Col>*/}
                        {/*<Col md={4}><Office onChange={this.onChangeDevInfo('office_id')} defaultSelected={devInfo.location_id} /></Col>*/}
                        {/*<Col md={4}><TextArea controlId="officeComment" onChange={this.onChangeOfficeComment} placeholder='Комментарий к офису' defaultValue='' label="Комментарий к оффису" /></Col>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}
                        {/*<Col md={3}><DevType onChange={this.onChangeDevType} defaultSelected={devInfo.dev_type_id} /></Col>*/}
                        {/*<Col md={3}><Platform defaultSelected={devInfo.platform_id}/></Col>*/}
                        {/*<Col md={3}><Software onChange={this.onChangeSoftware}  defaultSelected={devInfo.software_id} /></Col>*/}
                        {/*<Col md={3}><Input controlId='swVer' onChange={this.onChangeSoftwareVer} defaultValue={devInfo.software_ver} label="Версия ПО"/></Col>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}
                        {/*<Col md={3}><Input controlId='devSn' addOnPosition="left" addOnText="SN" onChange={this.onChangeSn} defaultValue={devInfo.platform_sn} label=" " disabled/></Col>*/}
                        {/*<Col md={3}><Input controlId='devAltSn' addOnPosition="left" addOnText="alt SN" onChange={this.onChangeAltSn} defaultValue={devInfo.platform_sn_alt} label=" " /></Col>*/}
                        {/*<Col md={3}><Input controlId='hostname' addOnPosition="left" addOnText="hostname" onChange={this.onChangeHostname} defaultValue={devInfo.dev_details && devInfo.dev_details.hostname} label=" " /></Col>*/}
                        {/*<Col md={3}><Input controlId='managementIP' addOnPosition="left" addOnText="management IP" onChange={this.onChangeMngIp} label=" " defaultValue={mngIp} /></Col>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}

                        {/*<Col md={6}><TextArea controlId="deviceComment" onChange={this.onChangeDeviceComment} placeholder='Комментарий к устройству' defaultValue={devInfo.dev_comment} label="Коментарий к устройству" /></Col>*/}
                    {/*</Row>*/}
                    {/*<Row><Col md={6}><CheckBox title="Устройство используется" onChange={this.onChangeDevInUse} checked={devInfo.dev_in_use} >Устройство используется</CheckBox></Col></Row>*/}
                    {/*<Row>*/}
                        {/*<Col md={10}><Modules data={modulesInfo} onChange={this.onChangeModuleComment} onChangeInUseStatus={this.onChangeModuleInUseStatus} /></Col>*/}
                        {/*<Col md={12}><Ports data={portsInfo} onChangeIsMng={this.onChangeIsMngCheckBox} /></Col>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}
                        {/*<Col md={10}>*/}
                            {/*<DevLocation {...devLocation} onChange={this.onChangeDevLocation} />*/}
                        {/*</Col>*/}
                    {/*</Row>*/}
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
                    const {location_id: office_id, city_id, region_id} = location
                    geoLocation = {office_id, city_id, region_id}
                    console.log('==========================', geoLocation)
                }
                this.initialData = {...this.initialData, devInfo, modules, ports, geoLocation}
                this.currentState = {
                    devInfo: JSON.parse(JSON.stringify(devInfo)),
                    modules: JSON.parse(JSON.stringify(modules)),
                    ports: JSON.parse(JSON.stringify(ports)),
                }
                console.log('didUpdate', this.initialData)
            } catch (e) {
                console.log('Loading dev data ERROR', e.toString())
            }

        }
    }
}

export default EditDevWindow
