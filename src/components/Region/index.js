import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'

const URL = 'http://netcmdb-loc.rs.ru:8082/api/getRegions.json'

class Region extends PureComponent {

    optionListUpdater = RemoteDataProvider(URL)
    render() {
        console.log('Region render')
        return <Select {...this.props} isAsync remoteDataFetch={this.optionListUpdater} />
    }
}

Region.propTypes = {
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
Region.defaultProps = {
    label: 'Регион',
    controlId: 'regionSelector',
    filter: {
        accessor: 'region_id',
        statement: '=',
        value: ''
    }
}
export default Region
