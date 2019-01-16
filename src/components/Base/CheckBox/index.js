import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import check from "check-types"
import {Checkbox} from "react-bootstrap"

class CheckBox extends PureComponent {
    state = {
        value: this.props.checked
    }

    handleOnChange = () => {
        this.setState({value: !this.state.value})
    }


    setDefaultValue = ((prevState) => (value) => {
        if (prevState !== value) {
            prevState = value
            this.setState({value})
        }
    })(this.props.checked)

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
        return (
            <Checkbox title={this.props.title} onChange={this.handleOnChange} checked={this.state.value} disabled={this.props.disabled} style={this.props.style} >{this.props.children}</Checkbox>
        )
    }

    componentDidMount() {
        this.setDefaultValue(this.props.checked)
        this.invokeListeners()
    }
    componentDidUpdate() {
        this.setDefaultValue(this.props.checked)
        this.invokeListeners()
    }
}

CheckBox.propTypes = {
    checked: PropTypes.bool,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
    style: PropTypes.object,
}
CheckBox.defaultProps = {
    disabled: false,
    checked: false
}

export default CheckBox
