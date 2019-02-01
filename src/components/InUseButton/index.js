import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import check from "check-types"
import {Button} from "react-bootstrap"

class InUseButton extends PureComponent {
    state = {
        value: this.props.defaultValue
    }
    handleOnClick = (e) => {
        this.setState({value: !this.state.value})
    }

    setDefaultValue = ((prevValue) => (value) => {
        if (prevValue !== value) {
            prevValue = value
            this.setState({value})
        }
    })(true)

    invokeListeners = () => {
        let {onChange} = this.props
        if (check.function(onChange)) {
            onChange = [onChange]
        }
        if (check.not.array(onChange)) return
        for (const subscriber of onChange) {
            subscriber(Object.assign({}, this.state))
        }
    }

    render() {
        return this.state.value ?
            <Button bsStyle="success" bsSize="xsmall" onClick={this.handleOnClick}>inUse</Button> :
            <Button bsStyle="danger" bsSize="xsmall" onClick={this.handleOnClick}>not inUse</Button>
    }

    componentDidMount() {
        this.setDefaultValue(this.props.defaultValue)
        this.invokeListeners()
    }
    componentDidUpdate() {
        this.setDefaultValue(this.props.defaultValue)
        this.invokeListeners()
    }
}

InUseButton.propTypes = {
    defaultValue: PropTypes.bool,
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),

}
InUseButton.defaultProps = {
    defaultValue: true
}
export default InUseButton
