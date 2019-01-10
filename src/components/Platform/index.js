import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'

const URL = 'http://netcmdb-loc.rs.ru:8082/api/getPlatforms.json'

class Platform extends PureComponent {

    updateOptionList = RemoteDataProvider(URL)
    render() {
        console.log('Platform render')
        return <Select {...this.props} isAsync remoteDataFetch={this.updateOptionList} />
    }
}


Platform.propTypes = {
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
Platform.defaultProps = {
    label: 'Платформа',
    controlId: 'platformSelector',
    selected: '',
    filter: {
        accessor: '',
        statement: '',
        value: ''
    }
}

export default Platform