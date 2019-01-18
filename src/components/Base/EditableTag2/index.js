import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import check from "check-types"
import ContentEditable from "react-contenteditable"

class EditableTag2 extends PureComponent {

    state = {
        value: ''
    }

    contentEditable = React.createRef()

    handleOnChange = (e) => {
        console.log('----------------', e.target.value)
        // this.setState({value: e.target.value})
        this.props.onChange(e.target.value)
    }


    // setDefaultValue = ((prevValue) => (value) => {
    //     if (value === undefined || value === null) return
    //     if (check.number(value)) value = value.toString()
    //     if (value && prevValue !== value) {
    //         prevValue = value
    //         this.setState({value})
    //     }
    // })(this.props.defaultValue)

    invokeListeners = ((prevState) => () => {
        // if (JSON.stringify(prevState) === JSON.stringify(this.state)) return
        // prevState = Object.assign({}, this.state)
        //
        // let {onChange} = this.props
        // if (check.function(onChange)) {
        //     onChange = [onChange]
        // }
        // if (check.not.array(onChange)) return
        // for (const subscriber of onChange) {
        //     subscriber(Object.assign({}, this.state))
        // }
    })({})

    render() {
        console.log('render')
        const html = this.props.defaultValue || ''
        return (
            <ContentEditable html={html} innerRef={this.contentEditable} onChange={this.handleOnChange} tagName={this.props.tagName} style={{'wordWrap': 'break-word'}} className={this.props.className} disabled={this.props.disabled} />
        )
    }

    componentDidMount() {
        // this.setDefaultValue(this.props.defaultValue)
        this.invokeListeners()
        console.log('did mount')
    }
    componentDidUpdate() {
        // this.setDefaultValue(this.props.defaultValue)
        this.invokeListeners()
        console.log('did update')
    }
}

EditableTag2.propTypes = {
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tagName: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
    className: PropTypes.string
}
EditableTag2.defaultProps = {
    defaultValue: '',
    tagName: 'div',
    disabled: true,
}

export default EditableTag2
