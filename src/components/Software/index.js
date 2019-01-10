import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'

const URL = 'http://netcmdb-loc.rs.ru:8082/api/getSoftwareList.json'

class Software extends PureComponent {

    updateOptionList = RemoteDataProvider(URL)
    render() {
        return <Select {...this.props} isAsync remoteDataFetch={this.updateOptionList} />
    }
}


Software.propTypes = {
    controlId: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
    filter: PropTypes.shape({
        accessor: PropTypes.string,
        statement: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ])
    })
}
Software.defaultProps = {
    label: 'ПО',
    controlId: 'softwareSelector',
    selected: '',
    filter: {
        accessor: '',
        statement: '',
        value: ''
    }
}

export default Software
