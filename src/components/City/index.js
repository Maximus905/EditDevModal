import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'
import check from "check-types"

const URL = 'http://netcmdb-loc.rs.ru:8082/api/getCities.json'

class City extends PureComponent {

    optionListUpdater = RemoteDataProvider(URL)
    render() {
        const onChange = check.function(this.props.onChange) ? this.props.onChange('city_id') : undefined
        return <Select {...this.props} onChange={onChange} isAsync remoteDataFetch={this.optionListUpdater} defaultSelected={this.props.defaultSelected} />
    }
}


City.propTypes = {
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
City.defaultProps = {
    label: 'Город',
    controlId: 'citySelector',
    filter: {
        accessor: 'region_id',
        statement: '',
        value: ''
    }
}

export default City
