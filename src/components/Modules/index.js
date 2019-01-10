import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Table, Button} from 'react-bootstrap'


class Modules extends Component {
    render() {
        return (
            <Table responsive bordered striped condensed>
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
                    <tr>
                        <td>#</td>
                        <td>moduleName</td>
                        <td>sn</td>
                        <td>comment</td>
                        <td align="middle"><Button bsStyle="success" bsSize="xsmall">not used</Button></td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}

Modules.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        vendor: PropTypes.string,
        module: PropTypes.string,
        sn: PropTypes.string,
        comment: PropTypes.string,
        inUse: PropTypes.bool
    })),
    onChange: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func)
]),
}

export default Modules
