import React, {Component} from 'react'
import PropTypes from 'prop-types'
import check from "check-types"
import ContentEditable from "react-contenteditable"

class EditableTag extends Component {

    state = {
        value: ''
    }

    contentEditable = React.createRef()

    handleOnChangeComment = (e) => {
        this.setState({value: e.target.value})
    }


    setDefaultValue = ((prevValue) => (value) => {
        if (check.nonEmptyString(value) && prevValue !== value) {
            prevValue = value
            this.setState({value})
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
            <ContentEditable html={this.state.value} innerRef={this.contentEditable} onChange={this.handleOnChangeComment} tagName={this.props.tagName} style={{'wordWrap': 'break-word'}} />
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
    defaultValue: PropTypes.string,
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
