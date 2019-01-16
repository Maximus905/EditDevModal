import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import check from "check-types"
import ContentEditable from "react-contenteditable"

class EditableTag extends PureComponent {

    state = {
        value: ''
    }

    contentEditable = React.createRef()

    handleOnChange = (e) => {
        console.log('----------------', e.target.value)
        this.setState({value: e.target.value})
    }


    setDefaultValue = ((prevValue) => (value) => {
        if (value === undefined || value === null) return
        if (check.number(value)) value = value.toString()
        if (value && prevValue !== value) {
            prevValue = value
            this.setState({value})
        }
    })('')

    invokeListeners = ((prevState) => () => {
        if (JSON.stringify(prevState) === JSON.stringify(this.state)) return
        prevState = Object.assign({}, this.state)

        let {onChange} = this.props
        if (check.function(onChange)) {
            onChange = [onChange]
        }
        if (check.not.array(onChange)) return
        for (const subscriber of onChange) {
            subscriber(Object.assign({}, this.state))
        }
    })({})

    render() {
        console.log('render')
        const html = this.state.value
        return (
            <ContentEditable html={html} innerRef={this.contentEditable} onChange={this.handleOnChange} tagName={this.props.tagName} style={{'wordWrap': 'break-word'}} disabled={this.props.disabled} />
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
