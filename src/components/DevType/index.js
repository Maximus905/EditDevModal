import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'

const URL = 'http://netcmdb-loc.rs.ru:8082/api/getDevTypes.json'

class DevType extends PureComponent {

    updateOptionList = RemoteDataProvider(URL)
    render() {
        console.log('DevType render')
        return <Select {...this.props} isAsync remoteDataFetch={this.updateOptionList} />
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
    filter: PropTypes.shape({
        accessor: PropTypes.string,
        statement: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ])
    })
}
DevType.defaultProps = {
    label: 'Тип(роль)',
    controlId: 'devTypeSelector',
    filter: {
        accessor: '',
        statement: '',
        value: ''
    }
}

export default DevType
