import React, {Component} from 'react'
import PropTypes from 'prop-types'
import check from "check-types"
import InUseButton from "../InUseButton"
import EditableTag from "../Base/EditableTag"
import {Table} from "react-bootstrap"

class Ports extends Component {
    portsSet = () => {
        const {data} = this.props
        if (check.not.array(data)) return
        return data.map((port, index) => {
            // const button = <InUseButton defaultValue={port.module_in_use} onChange={this.props.onChangeInUseStatus(index)} />
            const ipAddress = port.port_mask_len ? `${port.port_ip}/${port.port_mask_len}` : `${port.port_ip}`
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{port.port_details && port.port_details.portName}</td>
                    <td>VRF</td>
                    <td>{ipAddress}</td>
                    <td>{port.port_mac}</td>
                    <td>{port.port_details && port.port_details.description}</td>
                    <td align="center" valign="middle">mngmnt</td>
                </tr>
            )
        })
    }
    render() {
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
}

Ports.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        port_id: PropTypes.number,
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
