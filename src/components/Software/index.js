import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'
import {SOFTWARE_LIST} from '../../constants'

class Software extends PureComponent {

    optionListUpdater = RemoteDataProvider(SOFTWARE_LIST, 'softwareList')
    render() {
        return <Select {...this.props} isAsync remoteDataFetch={this.optionListUpdater} />
    }
}


Software.propTypes = {
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
Software.defaultProps = {
    label: 'ПО',
    controlId: 'softwareSelector',
}

export default Software
