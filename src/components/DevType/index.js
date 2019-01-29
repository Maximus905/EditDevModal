import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import Select from '../Base/Select'
import RemoteDataProvider from '../Base/RemoteDataProvider'
import check from "check-types"
import {DEV_TYPES} from '../../constants'

class DevType extends PureComponent {

    optionListUpdater = RemoteDataProvider(DEV_TYPES, 'devTypes')
    render() {
        const onChange = check.function(this.props.onChange) ? this.props.onChange('dev_type_id') : undefined
        console.log('devType', this.props.defaultSelected)
        return <Select {...this.props} onChange={onChange} isAsync remoteDataFetch={this.optionListUpdater} />
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
