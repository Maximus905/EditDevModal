import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Select'
import RemoteDataProvider from '../RemoteDataProvider'

const URL = 'http://netcmdb-loc.rs.ru:8082/api/getCities.json'

class City extends PureComponent {

    updateOptionList = RemoteDataProvider(URL)
    render() {
        console.log('City render')
        return <Select {...this.props} isAsync remoteDataFetch={this.updateOptionList} />
    }
}


City.propTypes = {
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
City.defaultProps = {
    label: 'Город',
    controlId: 'citySelector',
    selected: '',
    filter: {
        accessor: 'region_id',
        statement: '',
        value: ''
    }
}

export default City
