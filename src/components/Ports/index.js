import React, {PureComponent, Fragment} from 'react'
import PropTypes from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import check from "check-types"
import Input2 from "../Base/Input2"
import Select from "../Base/Select"
import {Row, Col, Checkbox, Table, Button} from "react-bootstrap"
import IpAddressEdit from '../IpAddressEdit'

class Ports extends PureComponent {
    state = {
        ports: [],
        ipEditMode: false,
    }

    setDefaultState = ((prevState) => (ports) => {
        if (check.not.array(ports) || ports.length === 0) return
        const portsCopy = cloneDeep(ports)
        const newState = portsCopy.map((port) => {
            return {...port, port_mask_len: (port.port_mask_len === null ? '' : port.port_mask_len)}
        })
        if (isEqual(prevState, newState)) return
        console.log('SET DEFAULT', newState)

        prevState = newState
        this.setState({ports: newState})
    })([])

    ipFormat = (value) => {
        const reg = new RegExp('^[0-9.]*$')
        return reg.test(value)
    }
    numericFormat = (value) => {
        const reg = new RegExp('^[0-9]*$')
        return reg.test(value)
    }
    macAddressFormat = (value) => {
        const reg = new RegExp('^[0-9a-fA-F:]*$')
        return reg.test(value)
    }

    handlerOnChangeCheckbox = (index) => () => {
        this.setState({ports: this.state.ports.map((port, idx) => {return idx === index ? {...port, port_is_mng: !port.port_is_mng} : {...port, port_is_mng: false}})})
    }
    onChangeIp = (index) => (e) => {
        if (!(this.ipFormat(e.target.value))) return
        if (this.state.ports && this.state.ports[index]) {
            const newPorts = cloneDeep(this.state.ports)
            newPorts[index].port_ip = e.target.value
            this.setState({ports: newPorts})
        }
    }
    onChangeMask = (index) => (e) => {
        if (!(this.numericFormat(e.target.value))) return
        if (this.state.ports && this.state.ports[index]) {
            const newPorts = cloneDeep(this.state.ports)
            newPorts[index].port_mask_len = e.target.value
            this.setState({ports: newPorts})
        }
    }
    onChangePortName = (index) => (e) => {
        if (this.state.ports && this.state.ports[index]) {
            const newPorts = cloneDeep(this.state.ports)
            newPorts[index].port_details.portName = e.target.value
            this.setState({ports: newPorts})
        }
    }
    onChangePortMac = (index) => (e) => {
        if (!(this.macAddressFormat(e.target.value))) return
        if (this.state.ports && this.state.ports[index]) {
            const newPorts = cloneDeep(this.state.ports)
            newPorts[index].port_mac = e.target.value
            this.setState({ports: newPorts})
        }
    }
    onChangePortDescription = (index) => (e) => {
        if (this.state.ports && this.state.ports[index]) {
            const newPorts = cloneDeep(this.state.ports)
            newPorts[index].port_details.description = e.target.value
            this.setState({ports: newPorts})
        }
    }
    onChangeVrf = (index) => ({value}) => {
        console.log('ONCHANGE===========', value)
        const [vrf] = this.props.vrfData.filter((item) => {return item.__id === value})
        // return
        if (this.state.ports && this.state.ports[index]) {
            const newPorts = cloneDeep(this.state.ports)
            newPorts[index].port_vrf_id = value
            newPorts[index].port_vrf_name = vrf.name
            this.setState({ports: newPorts})
        }
    }

    invokeListeners = ((prevState) => () => {
        if (isEqual(prevState, this.state)) return
        prevState = cloneDeep(this.state)

        let {onChange} = this.props
        if (check.function(onChange)) {
            onChange = [onChange]
        }
        if (check.not.array(onChange)) return
        for (const subscriber of onChange) {
            subscriber(Object.assign({}, this.state))
        }
    })({})
    vrfList = ((prevVrfData, prevList) => () => {
        const {vrfData} = this.props
        if (JSON.stringify(prevVrfData) === JSON.stringify(vrfData))  return prevList
        if (check.not.array(vrfData)) return prevList
        prevVrfData = vrfData
        prevList = vrfData.map((vrf) => {
            return {value: vrf.__id, label: vrf.name}
        })
        return prevList
    })([], [])
    // vrfList = () => [{value: 1, label: 'global'}, {value: 2, label: 'global2'}]
    newPort = () => {
        const vrfList = this.vrfList()
        const vrf_id = vrfList[0] ? vrfList[0].value : null
        const vrf_name = vrfList[0] ? vrfList[0].label : null
        return {
            port_id: null,
            port_ip: '0.0.0.0',
            port_comment: '',
            port_details: {
                portName: '',
                description: ''
            },
            port_is_mng: false,
            port_mac: '00:00:00:00:00:00',
            port_mask_len: '',
            port_vrf_id: vrf_id,
            port_vrf_name: vrf_name,
            newPort: true,
            deleted: false
        }
    }
    onClickAddPort = () => {
        const updatedPorts = cloneDeep(this.state.ports)
        if (check.not.array(updatedPorts)) return
        updatedPorts.push(this.newPort())
        this.setState({ports: updatedPorts})
    }
    onClickDelPort = (index) => () => {
        const updatedPorts = cloneDeep(this.state.ports)
        if (check.not.array(updatedPorts)) return
        updatedPorts[index].deleted = true
        this.setState({ports: updatedPorts})
    }


    portsSet = () => {
        const data = this.state.ports
        if (check.not.array(data)) return
        console.log('PORT_SET', data)
        const createdPorts = []
        const existedPorts = []
        const defaultVrf = this.vrfList()[0] ? this.vrfList()[0].value : ''
        data.forEach((port, index) => {
            let {port_ip, port_mac, port_mask_len, port_is_mng, port_details, port_vrf_name, newPort, deleted} = port
            if (!newPort) {
                const ipCell = port_is_mng ?
                    <IpAddressEdit ip={port_ip} mask={port_mask_len } onChangeIp={this.onChangeIp(index)} onChangeMask={this.onChangeMask(index)} /> :
                    (port_mask_len === '' ? `${port_ip}`: `${port_ip}/${port_mask_len}`)
                existedPorts.push(
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{port_details && port_details.portName}</td>
                        <td>{port_vrf_name}</td>
                        <td>{ipCell}</td>
                        <td>{port_mac}</td>
                        <td>{port_details && port_details.description}</td>
                        <td align="center" valign="middle">
                            <Checkbox title="management interface" onChange={this.handlerOnChangeCheckbox(index)} checked={port_is_mng} style={{marginTop: 0, marginBottom: 0}}/>
                        </td>
                    </tr>
                )
            } else {
                if (deleted) return
                const ipCell = <IpAddressEdit ip={port_ip} mask={port_mask_len } onChangeIp={this.onChangeIp(index)} onChangeMask={this.onChangeMask(index)} />
                createdPorts.push(
                    <tr key={index}>
                        <td><Button bsStyle="danger" bsSize="xsmall" onClick={this.onClickDelPort(index)}>Delete</Button></td>
                        <td><Input2 customSize clearMargin value={port_details && port_details.portName} onChange={this.onChangePortName(index)} /></td>
                        <td><Select optionList={this.vrfList()} defaultSelected={defaultVrf} onChange={this.onChangeVrf(index)} isAsync={false} emptyOption={false} clearMargin smallSize /></td>
                        <td>{ipCell}</td>
                        <td><Input2 customSize clearMargin value={port_mac} onChange={this.onChangePortMac(index)} /></td>
                        <td><Input2 customSize clearMargin value={port_details && port_details.description} onChange={this.onChangePortDescription(index)} /></td>
                        <td align="center" valign="middle">
                            <Checkbox title="management interface" onChange={this.handlerOnChangeCheckbox(index)} checked={port_is_mng} style={{marginTop: 0, marginBottom: 0}}/>
                        </td>
                    </tr>
                )
            }
        })
        return [...createdPorts.reverse(), ...existedPorts]
    }
    render() {
        return (
            <Fragment>
                <Row>
                    <Col md={12}>

                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Button bsStyle="primary" bsSize="small" style={{marginBottom: '1em'}} onClick={this.onClickAddPort}>Add port</Button>
                        <Table responsive bordered striped condensed style={{"tableLayout": "fixed"}}  >
                            <thead>
                            <tr>
                                <th className="col-xs-1 text-center">#</th>
                                <th className="col-xs-2 text-center" align="middle">Имя порта</th>
                                <th className="col-xs-1 text-center" align="middle">VRF</th>
                                <th className="col-xs-2 text-center" align="middle">IP</th>
                                <th className="col-xs-2 text-center" align="middle">MAC</th>
                                <th className="col-xs-3 text-center" align="middle">Комментарий</th>
                                <th className="col-xs-1 text-center" align="middle">Management</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.portsSet()}
                            </tbody>
                        </Table>
                    </Col>
                </Row>


            </Fragment>

        )
    }

    componentDidMount() {
        // console.log('Ports did mount===============', this.props.data)
        this.setDefaultState(this.props.data)
    }

    componentDidUpdate() {
        this.setDefaultState(this.props.data)
        this.invokeListeners()
    }
}

Ports.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        port_id: PropTypes.number,
        port_is_mng: PropTypes.bool,
        port_ip: PropTypes.string,
        port_mac: PropTypes.string,
        port_mask_len: PropTypes.number,
        port_details: PropTypes.shape({
            portName: PropTypes.string,
            description: PropTypes.string,
        }),
        port_comment: PropTypes.string,
        port_vrf_id: PropTypes.number,
        port_vrf_name: PropTypes.string
    })),
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
    vrfData: PropTypes.shape({
        __id: PropTypes.number,
        name: PropTypes.string,
        rd: PropTypes.string,
        comment: PropTypes.string,
    })
}

export default Ports
