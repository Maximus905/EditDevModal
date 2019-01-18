import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import check from "check-types"
import InUseButton from "../InUseButton"
import EditableTag from "../Base/EditableTag"
import Input from "../Base/Input"
import {Checkbox, Table} from "react-bootstrap"
import CheckBox from '../Base/CheckBox'

class Ports extends PureComponent {
    state = {
        ports: []
    }

    setDefaultState = ((prevState) => (ports) => {
        if (check.not.array(ports) || ports.length === 0) return
        const newState = ports.map((port) => {
            const {port_id, port_is_mng} = port
            return {port_id, port_is_mng }
        })

        if (JSON.stringify(prevState) === JSON.stringify(newState)) return
        console.log('SET DEFAULT', newState)
        prevState = newState
        this.setState({ports: newState})
    })([])

    handlerOnChangeCheckbox = (index) => () => {
        this.setState({ports: this.state.ports.map((port, idx) => {return idx === index ? {...port, port_is_mng: !port.port_is_mng} : {...port, port_is_mng: false}})})
    }

    invokeListeners = ((prevState) => () => {
        if (JSON.stringify(prevState) === JSON.stringify(this.state)) return
        prevState = Object.assign({}, this.state)

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
        const {data} = this.props
        if (check.not.array(data)) return

        return data.map((port, index) => {
            const ipAddress = port.port_mask_len ? `${port.port_ip}/${port.port_mask_len}` : `${port.port_ip}`
            const checkStatus = this.state.ports[index] ? this.state.ports[index].port_is_mng : false
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{port.port_details && port.port_details.portName}</td>
                    <td>VRF</td>
                    <td>{ipAddress}</td>
                    <td>{port.port_mac}</td>
                    <td>{port.port_details && port.port_details.description}</td>
                    <td align="center" valign="middle">
                        <Checkbox title="management interface" onChange={this.handlerOnChangeCheckbox(index)} checked={checkStatus} style={{marginTop: 0, marginBottom: 0}}/>
                        {/*<CheckBox title="management interface" onChange={this.props.onChange('port_is_mng')(index)} checked={port.port_is_mng} style={{marginTop: 0, marginBottom: 0}} />*/}
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
    })),
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
}

export default Ports
