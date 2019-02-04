import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Table} from 'react-bootstrap'
import EditableTag from "../Base/EditableTag"
import Select from "../Base/Select"

class DevLocation extends PureComponent {
    pStyle = {
        margin:0,
        padding: '6px 3px'
    }

    render() {
        const {onChange, floor, row, rack, unit, rackSide} = this.props
        const rackSideOptions = [{value: "Front", label: "Front"}, {value: "Back", label: "Back"}]
        return (
            <Table responsive bordered condensed style={{"tableLayout": "fixed"}}  >
                <thead>
                <tr>
                    <th className="col-xs-2 text-center" align="middle">Этаж</th>
                    <th className="col-xs-2 text-center" align="middle">Ряд</th>
                    <th className="col-xs-2 text-center" align="middle">Стойка</th>
                    <th className="col-xs-2 text-center" align="middle">Unit</th>
                    <th className="col-xs-3 text-center" align="middle">Сторона стойки</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><EditableTag disabled={false} tagName='p' value={floor} onChange={onChange('floor')} style={this.pStyle} /></td>
                        <td><EditableTag disabled={false} tagName='p' value={row} onChange={onChange('row')} style={this.pStyle} /></td>
                        <td><EditableTag disabled={false} tagName='p' value={rack} onChange={onChange('rack')} style={this.pStyle} /></td>
                        <td><EditableTag disabled={false} tagName='p' value={unit} onChange={onChange('unit')} style={this.pStyle} /></td>
                        <td><Select style={{marginBottom: 0}} isAsync={false} optionList={rackSideOptions} defaultSelected={rackSide} onChange={onChange('rackSide')} /></td>
                    </tr>

                </tbody>
            </Table>
        )
    }
}

DevLocation.propTypes = {
    floor: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    row: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rack: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rackSide: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
}
DevLocation.defaultProps = {
    floor: '',
    row: '',
    rack: '',
    unit: '',
    rackSide: ''
}

export default DevLocation
