import React, {PureComponent, Fragment} from 'react'
import PropTypes from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import css from './style.module.css'
import check from "check-types"
import InUseButton from "../InUseButton"
import EditableTag from "../Base/EditableTag"
import EditableTag2 from "../Base/EditableTag2"
import Input from "../Base/Input"
import Input2 from "../Base/Input2"
import {Checkbox, Table} from "react-bootstrap"
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
    newPort = () => {
        const portProps = {
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
            newPort: true
        }
        return portProps
    }


    portsSet = () => {
        const data = this.state.ports
        if (check.not.array(data)) return
        // console.log('PORT_SET', data)
        const newPorts = []
        const existedPorts = []
        data.forEach((port, index) => {
            if (!port.newPort) {

            } else {
                let {port_ip, port_mac, port_mask_len, port_is_mng, port_details, newPort} = port
                const ipCell = port_is_mng ?
                    <IpAddressEdit ip={port_ip} mask={port_mask_len } onChangeIp={this.onChangeIp(index)} onChangeMask={this.onChangeMask(index)} /> :
                    (port_mask_len === '' ? `${port_ip}`: `${port_ip}/${port_mask_len}`)
                existedPorts.push(
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{port_details && port_details.portName}</td>
                        <td>VRF</td>
                        <td>{ipCell}</td>
                        <td>{port_mac}</td>
                        <td>{port_details && port_details.description}</td>
                        <td align="center" valign="middle">
                            <Checkbox title="management interface" onChange={this.handlerOnChangeCheckbox(index)} checked={port_is_mng} style={{marginTop: 0, marginBottom: 0}}/>
                        </td>
                    </tr>
                )
            }
        })

        return data.map((port, index) => {
            let {port_ip, port_mac, port_mask_len, port_is_mng, port_details, newPort} = port
            const ipCell = port_is_mng ?
                <IpAddressEdit ip={port_ip} mask={port_mask_len } onChangeIp={this.onChangeIp(index)} onChangeMask={this.onChangeMask(index)} /> :
                (port_mask_len === '' ? `${port_ip}`: `${port_ip}/${port_mask_len}`)
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{port_details && port_details.portName}</td>
                    <td>VRF</td>
                    <td>{ipCell}</td>
                    <td>{port_mac}</td>
                    <td>{port_details && port_details.description}</td>
                    <td align="center" valign="middle">
                        <Checkbox title="management interface" onChange={this.handlerOnChangeCheckbox(index)} checked={port_is_mng} style={{marginTop: 0, marginBottom: 0}}/>
                    </td>
                </tr>
            )
        })
    }
    render() {
        // console.log('STATE', this.state)
        return (
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
        )
    }

    componentDidMount() {
        // console.log('Ports did mount===============', this.props.data)
        this.setDefaultState(this.props.data)
    }

    componentDidUpdate() {
        // console.log('Ports did mount===============', this.state.ports)
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
    })),
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
}

export default Ports
