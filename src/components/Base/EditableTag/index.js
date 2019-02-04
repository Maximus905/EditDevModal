import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import check from "check-types"
import ContentEditable from "react-contenteditable"

class EditableTag extends PureComponent {

    state = {
        value: ''
    }

    ref = React.createRef()

    formatValue = this.props.formatValue ? this.props.formatValue : (value) => value

    handleOnChange = (e) => {
        if (this.state.value === e.target.value) return
        if (this.props.stateless) {
            this.invokeListeners({value: this.formatValue(e.target.value)})
        } else {
            this.setState({value: e.target.value})
        }
    }

    setDefaultValue = ((prevValue) => (value) => {
        if (this.props.stateless || value === undefined || value === null) return
        if (prevValue !== value) {
            prevValue = value
            this.setState({value})
        }
    })('')

    invokeListeners = ((prevState) => (eventValue) => {
        const currentState = () => this.props.stateless ? eventValue : this.state

        if (currentState() === undefined || (!this.props.stateless && JSON.stringify(prevState) === JSON.stringify(currentState()))) return
        prevState = currentState()

        let {onChange} = this.props
        if (check.function(onChange)) {
            onChange = [onChange]
        }
        if (check.not.array(onChange)) return
        for (const subscriber of onChange) {
            subscriber(prevState)
        }
    })(this.props.stateless ? this.props.value : this.state)


    render() {
        const {value} = this.state
        const html = value === undefined || value === null ? '' : (value.toString ? value.toString() : '')
        const style = Object.assign({'wordWrap': 'break-word'}, this.props.style)
        return (

            <ContentEditable html={html} innerRef={this.ref} onChange={this.handleOnChange} tagName={this.props.tagName} style={style} className={this.props.className} disabled={this.props.disabled} />
        )
    }

    componentDidMount() {
        this.setDefaultValue(this.props.value)
        if (!this.props.stateless) this.invokeListeners()

    }
    componentDidUpdate() {
        this.setDefaultValue(this.props.value)
        if (!this.props.stateless) this.invokeListeners()
    }
}

EditableTag.propTypes = {
    stateless: PropTypes.bool,
    /**
     * in stateless mode value define component's state but in stateful mode it's default value and set up only once
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * returned value will be pass to external onChange functions and written in inner state
     * @param string value
     * @return (string|number|null)
     */
    formatValue: PropTypes.func,
    tagName: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
    className: PropTypes.string,
    style: PropTypes.object,
}
EditableTag.defaultProps = {
    stateless: false,
    value: '',
    tagName: 'div',
    disabled: true,
}

export default EditableTag
