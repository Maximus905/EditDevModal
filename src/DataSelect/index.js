import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

class DataSelect extends Component {

    state = {
        options: [
            { value: 'chocolate', label: 'Chocolate' },
            { value: 'strawberry', label: 'Strawberry' },
            { value: 'vanilla', label: 'Vanilla' }
        ],
        selected: {}
    }

    render() {
        return (
            <Select options={this.state.options} />
        )
    }
}

DataSelect.propTypes = {
    deviceId: PropTypes.number
}

export default DataSelect
