import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'
import {PLATFORMS} from '../../constants'

class Platform extends PureComponent {

    updateOptionList = RemoteDataProvider(PLATFORMS, 'platforms')
    render() {
        return <Select {...this.props} isAsync remoteDataFetch={this.updateOptionList} />
    }
}


Platform.propTypes = {
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
Platform.defaultProps = {
    label: 'Платформа',
    controlId: 'platformSelector',
}

export default Platform
