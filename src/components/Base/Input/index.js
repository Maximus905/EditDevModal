import React, {PureComponent, Fragment} from 'react'
import PropTypes from 'prop-types'
import check from 'check-types'
import custCss from './style.module.css'
import {FormGroup, FormControl, ControlLabel, InputGroup} from 'react-bootstrap'

class Input extends PureComponent {
    state = {
        value: ''
    }

    setDefaultValue = ((prevValue) => (value) => {
        if ((check.string(value) || check.number(value)) && prevValue !== value) {
            prevValue = value
            this.setState({value})
        }
    })('')

    handleChange = (e) => {
        this.setState({value: e.target.value})
    }

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
        const clearMargin = this.props.clearMargin ? custCss.formGroupZeroMargin : undefined
        const {addOnPosition, addOnText} = this.props
        const controlLabel = check.not.emptyString(this.props.label) ? <ControlLabel>{this.props.label}</ControlLabel> : null
        const formControl = <FormControl
            type="text"
            value={this.state.value}
            placeholder={this.props.placeholder}
            onChange={this.handleChange}
            readOnly={this.props.readOnly}
            disabled={this.props.disabled}
            style={this.props.style}
        />
        if (addOnPosition && check.nonEmptyString(addOnText)) {
            const leftAddOn = this.props.addOnPosition && this.props.addOnPosition === 'left' ? <InputGroup.Addon>{this.props.addOnText}</InputGroup.Addon> : null
            const rightAddOn = this.props.addOnPosition && this.props.addOnPosition === 'right' ? <InputGroup.Addon>{this.props.addOnText}</InputGroup.Addon> : null
            return (
                <Fragment>
                    <FormGroup controlId={this.props.controlId} bsClass={clearMargin}>
                        {controlLabel}
                        <InputGroup>
                            {leftAddOn}
                            {formControl}
                            {rightAddOn}
                        </InputGroup>
                    </FormGroup>
                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <FormGroup controlId={this.props.controlId} bsClass={clearMargin}>
                        {controlLabel}
                        {formControl}
                    </FormGroup>
                </Fragment>
            )
        }

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

Input.propTypes = {
    label: PropTypes.string,
    controlId: PropTypes.string,
    placeholder: PropTypes.string,
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
    addOnPosition: PropTypes.oneOf(['left', 'right']),
    addOnText: PropTypes.string,
    clearMargin: PropTypes.bool
}
Input.defaultProps = {
    label: '',
    disabled: false,
}
export default Input

