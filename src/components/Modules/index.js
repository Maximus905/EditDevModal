import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import check from 'check-types'
import {Table} from 'react-bootstrap'
import EditableTag from '../Base/EditableTag'
import InUseButton from '../InUseButton'

class Modules extends PureComponent {
    modulesSet = () => {
        const {data} = this.props
        if (check.not.array(data)) return
        return data.map((module, index) => {
            const button = <InUseButton defaultValue={module.module_item_in_use} onChange={this.props.onChange('module_item_in_use')(index)} />
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td className={module.module_item_not_found ? 'bg-danger' : null}>{module.module}</td>
                    <td>{module.module_item_sn}</td>
                    <EditableTag disabled={false} tagName={'td'} value={module.module_item_comment} onChange={this.props.onChange('module_item_comment')(index)}/>
                    <td align="center" valign="middle">{button}</td>
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
                        <th className="col-xs-3 text-center" align="middle">Модуль</th>
                        <th className="col-xs-3 text-center" align="middle">SN</th>
                        <th className="col-xs-3 text-center" align="middle">Комментарий</th>
                        <th className="col-xs-1 text-center" align="middle">In Use</th>
                    </tr>
                </thead>
                <tbody>
                    {this.modulesSet()}
                </tbody>
            </Table>
        )
    }
}

Modules.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        module: PropTypes.string,
        module_id: PropTypes.number,
        module_in_use: PropTypes.bool,
        module_item_details: PropTypes.object,
        module_item_comment: PropTypes.string,
        module_item_id: PropTypes.number,
        module_item_sn: PropTypes.string,
        module_not_found: PropTypes.bool,
    })),
    onChange: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func)
    ]),
}
Modules.defaultProps = {
    data: []
}

export default Modules
