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
import {Checkbox, Table} from "react-bootstrap"
import CheckBox from '../Base/CheckBox'
import IpAddressEdit from '../IpAddressEdit'

class Ports extends PureComponent {
    state = {
        ports: [],
        ipEditMode: false,
    }

    setDefaultState = ((prevState) => (ports) => {
        if (check.not.array(ports) || ports.length === 0) return
        const newState = cloneDeep(ports)
        if (isEqual(prevState, newState)) return
        console.log('SET DEFAULT', newState)
        prevState = newState
        this.setState({ports: newState})
    })([])

    handlerOnChangeCheckbox = (index) => () => {
        this.setState({ports: this.state.ports.map((port, idx) => {return idx === index ? {...port, port_is_mng: !port.port_is_mng} : {...port, port_is_mng: false}})})
    }
    onChangePort = (idx) => (key) => ({value}) => {
        console.log('test handler', value)
        if (this.state.ports[idx]) {
            const newState = cloneDeep(this.state.ports)
            newState[idx][key] = value
            console.log('change port ',this.state, key, idx, value, newState)
            this.setState({ports: newState})
        }
    }
    maskLenFormat = ((prevValue) => (value) => {
        if (check.not.string(value)) console.log('=========not string')
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
            prevValue = parseInt(value)
        }
        return  prevValue
    })(null)

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


    portsSet = () => {
        const data = this.state.ports
        if (check.not.array(data)) return
        console.log('PORT_SET', data)
        return data.map((port, index) => {
            const {port_ip, port_mac, port_mask_len, port_is_mng, port_details} = port
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{port_details && port_details.portName}</td>
                    <td>VRF</td>
                    <td>
                        <EditableTag stateless disabled={!port_is_mng} tagName='div' value={port_ip} onChange={this.onChangePort(index)('port_ip')} className={css.mask} />
                        {port_mask_len || port_is_mng ? '/' : null}
                        <EditableTag stateless disabled={!port_is_mng} tagName='div' value={port_mask_len} onChange={this.onChangePort(index)('port_mask_len')} formatValue={this.maskLenFormat} className={css.ip} />
                    </td>
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
        console.log('STATE', this.state)
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
        console.log('Ports did mount===============', this.props.data)
        this.setDefaultState(this.props.data)
    }

    componentDidUpdate() {
        console.log('Ports did mount===============', this.props.data)
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
