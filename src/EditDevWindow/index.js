import React, {Fragment, Component} from 'react'
import check from 'check-types'
import custCss from './style.module.css'
import axios from 'axios'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import {Row, Col, Button, Modal, ModalBody, ModalFooter, ModalHeader, } from 'react-bootstrap'
import Office from '../components/Office'
import Region from '../components/Region'
import City from '../components/City'
import DevType from '../components/DevType'
import Platform from '../components/Platform'
import Software from '../components/Software'
import Input from '../components/Base/Input'
import Input2 from '../components/Base/Input2'
import TextArea from '../components/Base/TextArea'
import TextArea2 from '../components/Base/TextArea2'
import CheckBox from '../components/Base/CheckBox'
import Modules from '../components/Modules'
import Ports from '../components/Ports'
import DevLocation from '../components/DevLocation'
import {DEV_DATA_URL, DEV_LOCATION_URL, DEV_MODULES_DATA_URL, DEV_PORTS_DATA_URL, DEV_SUBMIT_URL, VRF_LIST_URL} from'../constants'

class EditDevWindow extends Component {
    // constructor(props, context) {
    //     super(props, context);
    //     // this.handleShow = this.handleShow.bind(this);
    //     // this.handleClose = this.handleClose.bind(this);
    // }
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
      *     software_item_comment: string,
      *     dev_last_update: string,
      *     dev_in_use: boolean,
      *     platform_item_sn: string,
      *     platform_item_sn_alt: string,
      *     is_hw: boolean,
      *     software_item_ver: string,
      *     dev_details: (DevDetails|object),
      *     software_item_details: object
      * }} DevInfo
      *
      * @typedef {{
      *     module: string,
      *     module_id: number,
      *     module_item_id: number,
      *     module_item_details: object,
      *     module_item_comment: string,
      *     module_item_sn: string,
      *     module_item_in_use: boolean,
      *     module_item_not_found: boolean
      *     module_item_last_update: string
      * }} Module
      *
      * @typedef {{
      *     description: string,
      *     portName: string
      * }} PortDetails
      *
      * @typedef {{
      *     port_id: number,
      *     port_type_id: number,
      *     port_ip: string,
      *     port_comment: string,
      *     port_details: PortDetails,
      *     port_is_mng: boolean,
      *     port_mac: string,
      *     port_mask_len: (string|number),
      *     port_type: string,
      *     port_last_update: string,
      *     port_net_id: number,
      *     port_vrf_id: number,
      *     newPort: boolean // for created ports is true
      *     deleted: boolean // for deleted ports is true
      * }} Port
      *
      * @typedef {{
      *     region_id: (number|string),
      *     city_id: (number|string),
      *     office_id: (number|string)
      *     office_comment: string
      * }} GeoLocation
      *
      * @typedef {{
      *     accessor: string,
      *     statement: string,
      *     value: (string|number)
      * }} Filter
      *
      * @typedef {{
      *     vrf_id: number,
      *     vrf_name: string,
      *     vrf_rd: string
      *     vrf_comment: string
      * }} Vrf
      */

      /**
      * @type {{
      *     show: boolean,
      *     devId: (number|string),
      *     newDev: boolean,
      *     devDataLoading: boolean,
      *     devDataReady: boolean,
      *     mngIp: string,
      *     officeComment: string,
      *     loadingOfficeData: boolean,
      *     officeDataInvalidate: boolean,
      *     saving: boolean,
      *     region_id: string,
      *     city_id: string,
      * }} state
      */
    state = {
        show: false,
        newDev: false,
        devId: '',
        devDataLoading: false,
        devDataReady: false,
        mngIp: '',
        officeComment: '',
        loadingOfficeData: false,
        officeDataInvalidate: true,
        saving: false,
        region_id: '',
        city_id: '',
    }
    clearState = ((initialState) => () => {
        this.setState(cloneDeep(initialState))
    })(cloneDeep(this.state))
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
    clearInitialData = ((initialState) => () => {
        this.initialData = cloneDeep(initialState)
    })(cloneDeep(this.initialData))

    /**
     * @type {{
     *     geoLocation: (GeoLocation|object),
     *     devInfo: (DevInfo|object),
     *     modules: (Module[]|Array),
     *     ports: (Port[]|Array),
     *     newDev: boolean
     * }} currentState
     */
    currentState = {
        geoLocation: {},
        devInfo: {},
        modules: [],
        ports: [],
        newDev: false
    }
    clearCurrentState = ((initialState) => () => {
        this.currentState = cloneDeep(initialState)
    })(cloneDeep(this.currentState))

    /**
     *
     * @return GeoLocation
     */
    emptyGeoLocation = () => {
        return {
        region_id: '',
        city_id: '',
        office_id: '',
        office_comment: ''
    }}

    /**
     * @type Filter cityFilter
     */
    cityFilter = {
        accessor: 'region_id',
        statement: '=',
        value: ''
    }
    clearCityFilter = ((initialState) => () => {
        this.cityFilter = cloneDeep(initialState)
    })(cloneDeep(this.cityFilter))
    /**
     * @type Filter officeFilter
     */
    officeFilter = {
        accessor: 'city_id',
        statement: '=',
        value: ''
    }
    clearOfficeFilter = ((initialState) => () => {
        this.officeFilter = cloneDeep(initialState)
    })(cloneDeep(this.officeFilter))
    /**
     *
     * @type Site siteInfo
     */
    siteInfo = {
        floor: '',
        row: '',
        rack: '',
        unit: '',
        rackSide: '',
    }
    clearSiteInfo = ((initialState) => () => {
        this.siteInfo = cloneDeep(initialState)
    })(cloneDeep(this.siteInfo))


    clearFormData = () => {
        this.clearInitialData()
        this.clearCurrentState()
        this.clearOfficeFilter()
        this.clearCityFilter()
        this.clearSiteInfo()
        this.clearState()
    }
    /**
     *
     * @type (Vrf[]|Array)
     */
    vrfList = []
    getDevLocation = async (location_id) => {
        try {
            const res = await axios.get(DEV_LOCATION_URL, {
                params: {location_id: location_id}
            })
            const {data} = res
            if (!data.location) {
                console.log('ERROR: getDevLocation for loc_id ', data, location_id)
                return {}
            }
            return data
        } catch (e) {
            console.log('ERROR: getDevLocation', e.toString())
            return {}
        }
    }

    managingIp = (portsInfo) => {
        if (!check.array(portsInfo)) return
        const res = portsInfo.filter((port) => port.port_is_mng).map((port) => port.port_ip)
        return res.join(', ')
    }
    handleShow = () => {
        this.setState({ show: true });
    }

    handleClose = () => {
        this.clearFormData()
    }
    dataValidate = (devData) => {
        const errors = []
        if (check.not.number(devData.geoLocation.office_id)) errors.push('Не указан оффис')
        if (check.not.number(devData.devInfo.dev_type_id)) errors.push('Не указан тип оборудования')
        return errors
    }
    handleSubmit = async() => {
        const errors = this.dataValidate(this.currentState)
        if (check.nonEmptyArray(errors)) {
            alert(errors.join("\n"))
            return
        }
        try {
            this.setState({saving: true})
            /**
             * @typedef {{
             *     code: number,
             *     message: string
             * }} Error
             * @type {{
             *     errors: Error[]
             * }} res
             */
            const res = await axios.post(DEV_SUBMIT_URL, this.currentState)
            const {data} = res
            if (data.errors) throw data.errors.join("\n")
            this.setState({saving: false})
            console.log('SAVE RESULT', data.result)
            if (window.updateDevTable) {
                window.updateDevTable()
            } else {
                console.log('function updateDevTable not found')
            }
            setTimeout(() => {this.handleClose()}, 700)
        } catch (e) {
            console.log('ERROR: ', e)
            alert(e)
            this.setState({saving: false})
        }
    }

    onChangeGeoLocation = (key) => async ({value}) => {
        const {geoLocation} = this.currentState
        geoLocation[key] = value
        if (key === 'region_id' || key === 'city_id') {
            this.setState({[key]: value})
        }
        if (key === 'office_id') {
            this.onChangeDevInfo('location_id')({value})
            if (check.emptyString(value)) {
                const {geoLocation} = this.currentState
                geoLocation.office_comment = ''
                this.setState({officeDataInvalidate: true, officeComment: ''})
            } else {
                this.setState({officeDataInvalidate: true, loadingOfficeData: true})
                const res = await this.getDevLocation(value)
                const {location = {}} = res
                let {office_comment} = location
                office_comment = office_comment ? office_comment : ''
                const {geoLocation} = this.currentState
                geoLocation.office_comment = office_comment
                this.setState({officeComment: office_comment, officeDataInvalidate: false,loadingOfficeData: false})
            }

        }
    }
    onChangeOfficeComment = (e) => {
        const {geoLocation} = this.currentState
        geoLocation.office_comment = e.target.value
        this.setState({officeComment: e.target.value})
    }
    onChangeDevInfo = (key) => ({value}) => {
        const {devInfo} = this.currentState
        devInfo[key] = value
    }
    onChangeDevDetails = (key) => ({value}) => {
        const {devInfo} = this.currentState
        if (! devInfo.dev_details) devInfo.dev_details = {}
        devInfo.dev_details[key] = value
    }
    onChangeModule = (key) => (idx) => ({value}) => {
        const {modules} = this.currentState
        if (modules[idx] && modules[idx][key] !== value) {
            modules[idx][key] = value
        }
    }
    changeMngIpString = (ports) => {
        if (!check.array(ports)) return
        const res = ports.filter((port) => port.port_is_mng && !port.deleted).map((port) => port.port_ip)
        let mngIp = res.join(', ')
        if (this.state.mngIp !== mngIp) this.setState({mngIp})
        // if (res.length > 0) {
        //     this.setState({mngIp:res.join(', ') })
        // }
    }
    onChangePorts = ({ports}) => {
        ports = ports.map((port) => {
            return {...port, port_mask_len: port.port_mask_len === '' ? null : parseInt(port.port_mask_len)}
        })
        this.currentState.ports = ports
        this.changeMngIpString(this.currentState.ports)
    }
    onChangeDevLocation = (key) => ({value}) => {
        if (value === undefined || !this.state.devDataReady) return
        const {devInfo} = this.currentState
        if (!devInfo)  {
            return
        }
        if (!devInfo.dev_details) devInfo.dev_details = {}
        if ( !devInfo.dev_details.site) {
            devInfo.dev_details.site = this.siteInfo
        }
        devInfo.dev_details.site[key] = value
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
    fetchVrfList = async () => {
        try {
            const res = await axios.get(VRF_LIST_URL, {
                params: {}
            })
            const {data} = res
            if (!data.vrfList) {
                console.log('ERROR: fetchVrfList')
                return []
            }
            return data
        } catch (e) {
            console.log('ERROR: fetchVrfList', e.toString())
            return []
        }
    }

    memoizedCityFilter = ((prevFilter) => () => {
        const newCityFilter = Object.assign({}, this.cityFilter, {value: this.state.region_id})
        if (!isEqual(newCityFilter, prevFilter)) prevFilter = newCityFilter
        return [prevFilter]
    })([])

    memoizedOfficeFilter = ((prevFilter) => () => {
        const newCityFilter = Object.assign({}, this.cityFilter, {value: this.state.region_id})
        const newOfficeFilter = Object.assign({}, this.officeFilter, {value: this.state.city_id})
        const newFilter = [newCityFilter, newOfficeFilter]
        if (!isEqual(prevFilter, newFilter)) prevFilter = newFilter
        return prevFilter
    })([])

    render() {
        const {devDataReady} = this.state
        const {geoLocation, devInfo, modules, ports} = this.initialData
        const devSite = (() => {
            const {floor, row, rack, unit, rackSide} = devInfo && devInfo.dev_details && devInfo.dev_details.site ? devInfo.dev_details.site : {}
            return {floor, row, rack, unit, rackSide}
        })()
        const modalBody = () => {
            if (!this.state.show) return null
            if (!this.state.devDataReady) return <h3 align="center">Загрузка данных...</h3>
            return (
                <Fragment>
                    <Row>
                        <Col md={2}><Region onChange={this.onChangeGeoLocation('region_id')} defaultSelected={geoLocation.region_id} disabled={!devDataReady}/></Col>
                        <Col md={2}><City onChange={this.onChangeGeoLocation('city_id')} defaultSelected={geoLocation.city_id} filter={this.memoizedCityFilter()} disabled={!devDataReady}/></Col>
                        <Col md={4}><Office onChange={this.onChangeGeoLocation('office_id')} defaultSelected={geoLocation.office_id} filter={this.memoizedOfficeFilter()} disabled={!devDataReady}/></Col>
                        <Col md={4}><TextArea2 controlId="officeComment" disabled={this.state.officeDataInvalidate || !devDataReady} onChange={this.onChangeOfficeComment} placeholder='Комментарий к офису' value={this.state.officeComment} label="Комментарий к оффису" /></Col>
                    </Row>
                    <Row>
                        <Col md={3}><DevType onChange={this.onChangeDevInfo('dev_type_id')} defaultSelected={devInfo.dev_type_id} /></Col>
                        <Col md={3}><Platform onChange={this.onChangeDevInfo('platform_id')} defaultSelected={devInfo.platform_id}/></Col>
                        <Col md={3}><Software onChange={this.onChangeDevInfo('software_id')}  defaultSelected={devInfo.software_id} /></Col>
                        <Col md={3}><Input controlId='swVer' onChange={this.onChangeDevInfo('software_item_ver')} defaultValue={devInfo.software_item_ver} label="Версия ПО"/></Col>
                    </Row>
                    <Row>
                        <Col md={3}><Input controlId='devSn' addOnPosition="left" addOnText="SN" onChange={this.onChangeDevInfo('platform_item_sn')} defaultValue={devInfo.platform_item_sn} label=" " readOnly/></Col>
                        <Col md={3}><Input controlId='devAltSn' addOnPosition="left" addOnText="alt SN" onChange={this.onChangeDevInfo('platform_item_sn_alt')} defaultValue={devInfo.platform_item_sn_alt} label=" " /></Col>
                        <Col md={3}><Input controlId='hostname' addOnPosition="left" addOnText="hostname" onChange={this.onChangeDevDetails('hostname')} defaultValue={devInfo.dev_details && devInfo.dev_details.hostname} label=" " /></Col>
                        <Col md={3}><Input2 readOnly controlId='managementIP' addOnPosition="left" addOnText="management IP" onChange={()=>{}} label=" " value={this.state.mngIp} /></Col>
                    </Row>
                    <Row>
                        <Col md={6}><TextArea controlId="deviceComment" onChange={this.onChangeDevInfo('dev_comment')} placeholder='Комментарий к устройству' defaultValue={devInfo.dev_comment} label="Коментарий к устройству" /></Col>
                    </Row>
                    <Row><Col md={6}><CheckBox title="Устройство используется" onChange={this.onChangeDevInfo('dev_in_use')} checked={devInfo.dev_in_use} >Устройство используется</CheckBox></Col></Row>
                    <Row>
                        <Col md={10}><Modules data={modules} onChange={this.onChangeModule} /></Col>
                    </Row>
                    <Ports data={ports} vrfData={this.vrfList} onChange={this.onChangePorts} />
                    <Row>
                        <Col md={10}>
                            <DevLocation {...devSite} onChange={this.onChangeDevLocation} />
                        </Col>
                    </Row>
                </Fragment>
            )
        }
        const modalTitle = () => this.state.newDev ? 'Новое устройство' : 'Редактирование устройства'
        return (
            <Modal show={this.state.show} onHide={this.handleClose} bsSize="large" >
                <ModalHeader closeButton>
                    <Modal.Title>{modalTitle()}</Modal.Title>
                </ModalHeader>
                <ModalBody className={custCss.modalBody} >
                    {modalBody()}
                </ModalBody>
                <ModalFooter>
                    <Row>
                        <Col md={8}>
                            <h3 align="center" style={{margin: 0}}>{this.state.saving ? 'Сохранение данных...' : ''}</h3>
                        </Col>
                        <Col md={4}>
                            <Button onClick={this.handleClose} bsStyle="danger" disabled={this.state.saving} >Отмена</Button>
                            <Button onClick={this.handleSubmit} bsStyle="success" disabled={this.state.saving}>Сохранить</Button>
                        </Col>
                    </Row>
                </ModalFooter>
            </Modal>
        )
    }
    async componentDidMount() {
        window.openEditModal = (id) => {
            this.setState({
                show: true,
                devId: id,
                newDev: false,
                devDataReady: false
            })
        }
        window.openNewDevModal = () => {
            this.setState({
                show: true,
                devId: '',
                newDev: true,
                devDataReady: false
            })
        }
    }

    async componentDidUpdate() {
        const {devId, newDev, devDataReady, devDataLoading} = this.state
        if (! newDev && devId && !devDataReady && !devDataLoading) {
            this.setState({devDataLoading: true})
            // const devData = await this.fetchDeviceData(this.state.devId)
            try {
                const response1 = await Promise.all([
                    this.fetchDeviceData(devId),
                    this.fetchDevModulesData(devId),
                    this.fetchDevPortsData(devId),
                    this.fetchVrfList()
                ])
                const [{devInfo}, {modules}, {ports}, {vrfList}] = response1
                let geoLocation = {}
                if (devInfo && devInfo.location_id) {
                    const response2 = await this.getDevLocation(devInfo.location_id)
                    const {location = {}} = response2
                    geoLocation = (({office_id, city_id, region_id, office_comment}) => {return {office_id, city_id, region_id, office_comment}})(location)
                }
                this.initialData = {...this.initialData, devInfo, modules, ports, geoLocation}
                this.vrfList = vrfList
                this.currentState = {
                    ...this.currentState,
                    geoLocation: cloneDeep(geoLocation),
                    devInfo: cloneDeep(devInfo),
                    modules: cloneDeep(modules),
                    ports: cloneDeep(ports),
                }
                this.setState({devDataLoading: false, devDataReady: true})
            } catch (e) {
                console.log('Loading dev data ERROR', e.toString())
            }

        } else if (newDev && !devDataReady && !devDataLoading) {
            this.setState({devDataLoading: true})
            const response1 = await this.fetchVrfList()
            const {vrfList} = response1
            this.vrfList = vrfList
            this.initialData.geoLocation = this.emptyGeoLocation()
            this.currentState.geoLocation = this.emptyGeoLocation()
            this.currentState.newDev = true
            this.setState({devDataLoading: false, devDataReady: true})
        }
    }
}

export default EditDevWindow
