import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import check from 'check-types'
import {FormControl, FormGroup, ControlLabel} from 'react-bootstrap'

class TextArea extends PureComponent {
    state = {
        value: ''
    }
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
    setDefaultValue = ((prevValue) => (value) => {
        if (value === undefined || value === null) return
        if (prevValue === value) return
        prevValue = value
        this.setState({value})
        // if (check.nonEmptyString(value) && prevValue !== value) {
        //     prevValue = value
        //     this.setState({value})
        // }
    })('')

    render() {
        const controlLabel = check.not.emptyString(this.props.label) ? <ControlLabel>{this.props.label}</ControlLabel> : null
        return (
            <FormGroup controlId="formControlsTextarea">
                {controlLabel}
                <FormControl componentClass="textarea" placeholder={this.props.placeholder} onChange={this.handleChange} value={this.state.value} />
            </FormGroup>
        )
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

TextArea.propTypes = {
    label: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    controlId: PropTypes.string,
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    placeholder: PropTypes.string
}
TextArea.defaultProps = {
}

export default TextArea