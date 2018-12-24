import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {FormControl, ControlLabel, FormGroup} from 'react-bootstrap'
import check from 'check-types'

class Select extends Component {

    state = {
        selected: this.props.selected,
        isLoading: false,
    }
    optionList = (() => {
        const {isAsync, optionList} = this.props
        return isAsync ? [] : optionList
    })()

    submit = () => {
        console.log('submit', this.state)
    }

    handleChange = (e) => {
        console.log(('change select'))
        this.setState({ selected: e.target.value });
    }


    invokeListeners = () => {
        let {subscribers} = this.props
        if (check.array(subscribers)) {
            subscribers = subscribers.filter((item => check.function(item)))
        } else if (check.function(subscribers)) {
            subscribers = [subscribers]
        } else {
            subscribers = []
        }
        for (const sub of subscribers) {
            sub(this.state)
        }
    }

    getRemoteOptionList() {
        this.setState({isLoading: true})
        return setTimeout(() => {
            this.optionList = this.props.optionList
            this.setState({isLoading: false})
        }, 3000)
    }

    makeOptionList = () => {
        let validSelected = false
        const list = this.optionList.map(
            ({value, title}, key) => {
                if (value == this.props.selected) validSelected = true
                return <option value={value} key={key}>{title}</option>
            }
        )
        if (! validSelected) {
            const placeholder = <option value='' key={list.length}>{this.props.placeHolder}</option>
            list.unshift(placeholder)
        }
        return list
    }

    render() {
        return (
            <Fragment>
                <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Select</ControlLabel>
                    <FormControl
                        onChange={this.handleChange}
                        componentClass="select"
                        placeholder="select item"
                        value={this.state.selected}
                    >
                        {this.state.isLoading ?
                            <option value={null}>Loading...</option> :
                            this.makeOptionList()
                        }
                    </FormControl>
                </FormGroup>
            </Fragment>
        );
    }
    componentDidMount() {
        if (this.props.isAsync) {
            this.getRemoteOptionList()
        }
        this.invokeListeners()
    }
    componentDidUpdate() {
        this.invokeListeners()
    }
}

/**
 *
 * isAsync - if true, will be used  getDataUrl to get options list. optionList parameter will be ignored
 * subscribers - function or array of functions, that will be invoke on state change
 */
Select.propTypes = {
    deviceId: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    controlId: PropTypes.string,
    //initial optionList
    optionList: PropTypes.arrayOf(PropTypes.shape(
        {
            value: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            title: PropTypes.string
        }
    )),
    placeHolder: PropTypes.string,
    selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isAsync: PropTypes.bool,
    remoteSourceUrl: PropTypes.string,
    remoteOptionList: PropTypes.func,
    subscribers: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ])
}
Select.defaultProps = {
    optionList: [],
    isAsync: false,
    subscribers: [],
    selected: '',
    placeHolder: 'Select'
}

export default Select
