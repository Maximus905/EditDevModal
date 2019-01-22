import React, {PureComponent, Fragment} from 'react'
import PropTypes from 'prop-types'
import check from 'check-types'
import css from './style.module.css'
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap'

class Input2 extends PureComponent {

    render() {
        const clearMargin = this.props.clearMargin ? css.formGroupZeroMargin : undefined
        const controlLabel = check.not.emptyString(this.props.label) ? <ControlLabel>{this.props.label}</ControlLabel> : null
        return (
            <Fragment>
                <FormGroup controlId={this.props.controlId} bsClass={clearMargin}>
                    {controlLabel}
                    <FormControl
                        type="text"
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        onChange={this.props.onChange}
                        readOnly={this.props.readOnly}
                        disabled={this.props.disabled}
                        className={css.size}
                    />
                </FormGroup>
            </Fragment>
        )
    }

    componentDidMount() {
    }
    componentDidUpdate() {
    }
}

Input2.propTypes = {

    label: PropTypes.string,
    controlId: PropTypes.string,
    placeholder: PropTypes.string,
    ip: PropTypes.string,
    mask: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    onChangeIp: PropTypes.func,
    onChangeMask: PropTypes.func,
    clearMargin: PropTypes.bool
}
Input2.defaultProps = {
    label: '',
    disabled: false,
    clearMargin: true
}
export default Input2

