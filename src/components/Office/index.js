import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'
import check from "check-types"

const URL = 'http://netcmdb-loc.rs.ru:8082/api/getOffices.json'

class Office extends PureComponent {

    optionListUpdater = RemoteDataProvider(URL)
    render() {
        const onChange = check.function(this.props.onChange) ? this.props.onChange('office_id') : undefined
        return <Select {...this.props} onChange={onChange} isAsync remoteDataFetch={this.optionListUpdater} />
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
    filter: PropTypes.shape({
        accessor: PropTypes.string,
        statement: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ])
    })
}
Office.defaultProps = {
    label: 'Офис',
    controlId: 'officeSelector',
    filter: {
        accessor: 'city_id',
        statement: '',
        value: ''
    }
}

export default Office
