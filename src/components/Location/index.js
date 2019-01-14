import React, {Component} from 'react'
import PropTypes from 'prop-types'

class Location extends Component {
    render() {
        return (
            <div>

            </div>
        )
    }
}

Location.propTypes = {
    data: PropTypes.shape({
        floor: PropTypes.string,
        row: PropTypes.string,
        rack: PropTypes.string,
        unit: PropTypes.string,
        rackSide: PropTypes.string
    })
}

export default Location
