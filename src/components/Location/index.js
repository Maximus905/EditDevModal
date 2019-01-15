import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Table} from 'react-bootstrap'
import EditableTag from "../Base/EditableTag"

class Location extends PureComponent {

    state = {
        floor: ''
    }

    render() {
        console.log('2222', this.props.data)
        const {floor, row, rack, unit, rackSide} = this.props.data
        console.log('777777777777777', floor)
        return (
            <Table responsive bordered striped condensed style={{"tableLayout": "fixed"}}  >
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
                        {/*<td>{floor}</td>*/}
                        <EditableTag disabled={false} tagName='td' defaultValue={floor} />
                        <EditableTag disabled={false} tagName='td' defaultValue={row} />
                        <EditableTag disabled={false} tagName='td' defaultValue={rack} />
                        <EditableTag disabled={false} tagName='td' defaultValue={unit} />
                        <EditableTag disabled={false} tagName='td' defaultValue={rackSide} />
                    </tr>

                </tbody>
            </Table>
        )
    }
}

Location.propTypes = {
    data: PropTypes.shape({
        floor: PropTypes.string,
        row: PropTypes.string,
        rack: PropTypes.string,
        unit: PropTypes.string,
        rackSide: PropTypes.string
    })
}
Location.defaultProps = {
    data: {}
}

export default Location
