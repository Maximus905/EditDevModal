import React, {PureComponent, Fragment} from 'react'
import PropTypes from 'prop-types'
import check from 'check-types'
import css from './style.module.css'
import {FormGroup, FormControl, ControlLabel, InputGroup} from 'react-bootstrap'

class Input2 extends PureComponent {

    render() {
        const clearMargin = this.props.clearMargin ? css.formGroupZeroMargin : undefined
        const {addOnPosition, addOnText} = this.props
        const controlLabel = check.not.emptyString(this.props.label) ? <ControlLabel>{this.props.label}</ControlLabel> : null
        const formControl = <FormControl
            type="text"
            value={this.props.value}
            placeholder={this.props.placeholder}
            onChange={this.props.onChange}
            readOnly={this.props.readOnly}
            disabled={this.props.disabled}
            className={this.props.customSize ? css.size : undefined}
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
    }
    componentDidUpdate() {
    }
}

Input2.propTypes = {
    customSize: PropTypes.bool,
    label: PropTypes.string,
    controlId: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    addOnPosition: PropTypes.oneOf(['left', 'right']),
    addOnText: PropTypes.string,
    clearMargin: PropTypes.bool
}
Input2.defaultProps = {
    disabled: false,
    clearMargin: true
}
export default Input2

