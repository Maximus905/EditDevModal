import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import check from "check-types"
import ContentEditable from "react-contenteditable"

class EditableTag extends PureComponent {

    state = {
        value: ''
    }

    contentEditable = React.createRef()

    handleOnChangeComment = (e) => {
        this.setState({value: e.target.value})
    }


    setDefaultValue = ((prevValue) => (value) => {
        let normalized = value
        if (check.number(value)) {
            normalized = value.toString()
        }
        if (check.nonEmptyString(normalized) && prevValue !== normalized) {
            prevValue = normalized
            this.setState({value: normalized})
        }
    })('')

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
            <ContentEditable html={this.state.value} innerRef={this.contentEditable} onChange={this.handleOnChangeComment} tagName={this.props.tagName} style={{'wordWrap': 'break-word'}} disabled={this.props.disabled} />
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

EditableTag.propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tagName: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
}
EditableTag.defaultProps = {
    defaultValue: '',
    tagName: 'div',
    disabled: true,
}

export default EditableTag
