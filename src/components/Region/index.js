import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Select'
import RemoteDataProvider from '../RemoteDataProvider'

const URL = 'http://netcmdb-loc.rs.ru:8082/api/getRegions.json'

class Region extends PureComponent {

    optionListUpdater = RemoteDataProvider(URL)
    render() {
        console.log('Office render')
        return <Select {...this.props} isAsync remoteDataFetch={this.optionListUpdater} />
    }
}

Region.propTypes = {
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
Region.defaultProps = {
    label: 'Регион',
    controlId: 'regionSelector',
    selected: '',
    filter: {
        accessor: 'region_id',
        statement: '=',
        value: ''
    }
}
export default Region
