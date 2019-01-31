import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'
import {CITIES_URL} from '../../constants'


class City extends PureComponent {

    optionListUpdater = RemoteDataProvider(CITIES_URL, 'cities')
    render() {
        return <Select {...this.props} onChange={this.props.onChange} isAsync remoteDataFetch={this.optionListUpdater} defaultSelected={this.props.defaultSelected} filter={this.props.filter} />
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
    filter: PropTypes.arrayOf(PropTypes.shape({
        accessor: PropTypes.string,
        statement: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ])
    }))
}
City.defaultProps = {
    label: 'Город',
    controlId: 'citySelector',
    // filter: {
    //     accessor: 'region_id',
    //     statement: '',
    //     value: ''
    // }
}

export default City
