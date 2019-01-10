import React, { PureComponent, Fragment} from 'react'
import PropTypes from 'prop-types'
import {FormControl, ControlLabel, FormGroup} from 'react-bootstrap'
import check from 'check-types'
import axios from "axios"

class Select extends PureComponent {

    state = {
        selected: check.number(this.props.selected) ? this.props.selected.toString() : this.props.selected,
        propsSelected: '',
        isLoading: false,
        optionsInvalidate: true,
        filter: {}
    }
    optionList = []

    handleChange = (e) => {
        console.log(('handleChange in Select'))
        this.setState({selected: e.target.value})
    }


    invokeListeners = () => {
        console.log('invoke listeners', this.state.selected, this.filter)
        let {onChange} = this.props
        if (check.function(onChange)) {
            onChange = [onChange]
        }
        if (check.not.array(onChange)) return
        for (const subscriber of onChange) {
            subscriber(Object.assign({}, this.state))
        }
    }

    async updateIfNeeded() {

        const {isAsync, disabled} = this.props
        const {isLoading, optionsInvalidate} = this.state

        if (isLoading || disabled) return
        if (!optionsInvalidate) return

        console.log('options list will be updated remotely')
        if (isAsync) {
            this.setState({isLoading: true})
            this.optionList = await this.updateRemoteOptionList()
            console.log('remote list is updated')
        } else {
            this.optionList = this.updateLocalOptionList()
        }
        this.setState({isLoading: false, optionsInvalidate: false})
    }

    async updateRemoteOptionList() {
        const {remoteDataFetch = this.remoteDataFetchDefault} = this.props
        try {
            const data = await remoteDataFetch(this.filter)
            return check.array(data) ? data : []
        } catch (error) {
            console.log('error in Select: ', error)
        }


    }
    updateLocalOptionList() {
        return this.props.optionList
    }

    async remoteDataFetchDefault() {
        const {remoteSourceUrl, filter={}} = this.props
        try {
            const {data} = await axios.post(remoteSourceUrl, filter)
            console.log('fetched data: ',data)
            return check.array(data) ? data : []
        } catch (error) {
            console.log('error: ', error)
        }
    }


    checkSelectedValue(optionList) {
        const {selected} = this.state
        const filtered = optionList.filter((item) => {
            return item.value.toString() === selected
        })
        return filtered.length > 0
    }

    buildOptionList = () => {
        const {isLoading} = this.state
        if (isLoading) return <option value={null}>Loading...</option>

        const emptyOption = <option value={this.props.emptyValue} key='empty'>{this.props.emptyLabel}</option>
        const optionsSet = this.optionList.map(
            ({value, label}, key) => {
                return <option value={value} key={key}>{label}</option>
            })
        return [emptyOption, ...optionsSet]
    }


    render() {
        console.log('Select render')
        const {selected} = this.state

        const controlLabel = check.not.emptyString(this.props.label) ? <ControlLabel>{this.props.label}</ControlLabel> : null
        return (
            <Fragment>
                <FormGroup controlId={this.props.controlId}>
                    {controlLabel}
                    <FormControl
                        onChange={this.handleChange}
                        componentClass="select"
                        placeholder="select item"
                        value={selected}
                        disabled={this.props.disabled}
                    >
                        {this.buildOptionList()}
                    </FormControl>
                </FormGroup>
            </Fragment>
        );
    }
    static getDerivedStateFromProps(props, state) {
        console.log('getDerivedStateFromProps in Select')
        let propsSelected = check.number(props.selected) ? props.selected.toString() : props.selected
        let newState = {}
        if (JSON.stringify(state.filter) !== JSON.stringify(props.filter)) {
            newState = Object.assign(newState, {
                filter: props.filter,
                optionsInvalidate: true
            })
        }

        if (check.not.emptyString(propsSelected) && propsSelected !== state.propsSelected) {
            newState = Object.assign(newState, {
                propsSelected: propsSelected,
                selected: propsSelected !== state.selected ? propsSelected : state.selected
            })
        }
        if (check.nonEmptyObject(newState)) {
            return newState
        }
        return null
    }
    async componentDidMount() {
        console.log('didMounted', this.state)
        await this.updateIfNeeded()
    }
    async componentDidUpdate() {
        console.log('didUpdated Select')
        await this.updateIfNeeded()
        this.invokeListeners()
    }
}

/**
 *
 * isAsync - if true, will be used  getDataUrl to get options list. optionList parameter will be ignored
 * onChange - function or array of functions, that will be invoke on state change
 */
Select.propTypes = {
    deviceId: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    controlId: PropTypes.string,
    //local option list if isAsync = false
    optionList: PropTypes.arrayOf(PropTypes.shape(
        {
            value: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ]),
            label: PropTypes.string
        }
    )),
    disabled: PropTypes.bool,
    label: PropTypes.string,
    emptyValue: PropTypes.string,
    emptyLabel: PropTypes.string,
    selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isAsync: PropTypes.bool,
    remoteSourceUrl: PropTypes.string,
    remoteDataFetch: PropTypes.func,
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
    filter: PropTypes.shape({
        accessor: PropTypes.string,
        statement: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ])
    })
}
Select.defaultProps = {
    optionList: [],
    isAsync: false,
    onChange: [],
    emptyValue: '',
    emptyLabel: '<Не выбрано>',
    filter: {},
    selected: ''
}

export default Select
