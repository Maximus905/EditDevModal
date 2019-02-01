import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'
import {DEV_TYPES} from '../../constants'

class DevType extends PureComponent {

    optionListUpdater = RemoteDataProvider(DEV_TYPES, 'devTypes')
    render() {
        return <Select {...this.props} isAsync remoteDataFetch={this.optionListUpdater} />
    }
}


DevType.propTypes = {
    controlId: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    defaultSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
    filter: PropTypes.arrayOf(PropTypes.shape({
        accessor: PropTypes.string,
        statement: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ])
    }))
}
DevType.defaultProps = {
    label: 'Тип(роль)',
    controlId: 'devTypeSelector',
}

export default DevType
