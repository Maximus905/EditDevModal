import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import check from 'check-types'
import {FormControl, FormGroup, ControlLabel} from 'react-bootstrap'

class TextArea2 extends PureComponent {

    render() {
        const controlLabel = check.not.emptyString(this.props.label) ? <ControlLabel>{this.props.label}</ControlLabel> : null
        return (
            <FormGroup controlId="formControlsTextarea">
                {controlLabel}
                <FormControl componentClass="textarea" placeholder={this.props.placeholder} onChange={this.props.onChange} value={this.props.value} />
            </FormGroup>
        )
    }
    componentDidMount() {}
    componentDidUpdate() {}
}

TextArea2.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    controlId: PropTypes.string,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    placeholder: PropTypes.string
}
TextArea2.defaultProps = {
}

export default TextArea2