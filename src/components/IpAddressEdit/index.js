import React, {PureComponent, Fragment} from 'react'
import PropTypes from 'prop-types'
import check from 'check-types'
import css from './style.module.css'
import {FormGroup, FormControl, ControlLabel} from 'react-bootstrap'

class IpAddressEdit extends PureComponent {
    state = {
        ip: '',
        mask: ''
    }

    setDefaultIp = ((prevValue) => (value) => {
        if (check.nonEmptyString(value) && prevValue !== value) {
            prevValue = value
            this.setState({ip: value})
        }
    })('')
    setDefaultMask = ((prevValue) => (value) => {
        if (check.integer(value) && prevValue !== value) {
            prevValue = value
            this.setState({mask: value})
        }
    })('')

    // handleChangeIp = (e) => {
    //     this.setState({ip: e.target.value})
    // }
    // handleChangeMask = (e) => {
    //     this.setState({mask: e.target.value})
    // }
    handleChangeIp = (e) => {
        this.setState({ip: e.target.value})
    }
    handleChangeMask = (e) => {
        this.setState({mask: e.target.value})
    }

    // invokeListeners = () => {
    //     let {onChange} = this.props
    //     if (check.function(onChange)) {
    //         onChange = [onChange]
    //     }
    //     if (check.not.array(onChange)) return
    //     for (const subscriber of onChange) {
    //         subscriber(Object.assign({}, this.state))
    //     }
    // }

    render() {
        const clearMargin = this.props.clearMargin ? css.formGroupZeroMargin : undefined
        const controlLabel = check.not.emptyString(this.props.label) ? <ControlLabel>{this.props.label}</ControlLabel> : null
        const formControlIp = <FormControl
            type="text"
            // value={this.state.ip}
            value={this.props.ip}
            placeholder={this.props.placeholder}
            // onChange={this.handleChangeIp}
            onChange={this.props.onChangeIp}
            readOnly={this.props.readOnly}
            disabled={this.props.disabled}
            className={css.ip}
        />
        const formControlMask= <FormControl
            type="text"
            // value={this.state.mask}
            value={this.props.mask}
            placeholder={this.props.placeholder}
            // onChange={this.handleChangeMask}
            onChange={this.props.onChangeMask}
            readOnly={this.props.readOnly}
            disabled={this.props.disabled}
            className={css.mask}
        />
        return (
            <Fragment>
                <FormGroup controlId={this.props.controlId} bsClass={clearMargin}>
                    {controlLabel}
                    {formControlIp} / {formControlMask}
                </FormGroup>
            </Fragment>
        )
    }

    componentDidMount() {
        // this.setDefaultIp(this.props.ip)
        // this.setDefaultMask(this.props.mask)
        // this.invokeListeners()
    }
    componentDidUpdate() {
        // this.setDefaultIp(this.props.ip)
        // this.setDefaultMask(this.props.mask)
        // this.invokeListeners()
    }
}

IpAddressEdit.propTypes = {

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
IpAddressEdit.defaultProps = {
    label: '',
    disabled: false,
    clearMargin: true
}
export default IpAddressEdit

