import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'
import {OFFICES_URL} from '../../constants'

class Office extends PureComponent {

    optionListUpdater = RemoteDataProvider(OFFICES_URL, 'offices')
    render() {
        return <Select {...this.props} isAsync remoteDataFetch={this.optionListUpdater} />
    }
}


Office.propTypes = {
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
Office.defaultProps = {
    label: 'Офис',
    controlId: 'officeSelector',
}

export default Office
