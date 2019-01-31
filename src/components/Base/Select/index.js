import React, { PureComponent, Fragment} from 'react'
import PropTypes from 'prop-types'
import {FormControl, ControlLabel, FormGroup} from 'react-bootstrap'
import check from 'check-types'
import axios from "axios"
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import css from "./style.module.css"

class Select extends PureComponent {

    state = {
        value: '',
        isLoading: false,
        optionsInvalidate: true,
    }
    optionList = []

    setDefaultSelected = ((prevValue) => (value) => {
        if (value === undefined || value === null || this.state.optionsInvalidate || this.state.isLoading) return
        if (prevValue === value) return
        prevValue = value
        if (this.optionList.filter((item) => item.value === value).length === 0) return
        if (this.state.value === value) return
        this.setState({value: prevValue})
    })('')

    handleChange = (e) => {
        console.log('type', typeof e.target.value)
        let value = parseInt(e.target.value)
        if (!isNaN(value) && value.toString && value.toString() === e.target.value) {
            this.setState({value})
        }  else {
            this.setState({value: e.target.value})
        }
    }
    defaultSelectedValue = () => {
        return this.optionList.length === 1 ? this.optionList[0].value : ''
    }

    checkSelected = () => {
        if (this.state.isLoading || this.props.disabled) return
        if (this.optionList.filter((item) => item.value === this.state.value).length === 0) this.setState({value: this.defaultSelectedValue()})
    }
    checkFilter = ((prevFilter) => () => {
        const {filter} = this.props
        if (isEqual(prevFilter, filter)) return
        prevFilter = filter
        return this.setState({optionsInvalidate: true})
    })(this.props.filter)


    invokeListeners = ((prevState) => () => {
        if (JSON.stringify(this.state) === JSON.stringify(prevState)) return
        let {onChange} = this.props
        if (check.function(onChange)) {
            onChange = [onChange]
        }
        if (check.not.array(onChange)) return
        prevState = cloneDeep(this.state)
        for (const subscriber of onChange) {
            subscriber(prevState)
        }
    })([])

    async updateIfNeeded() {

        const {isAsync, disabled} = this.props
        const {isLoading, optionsInvalidate} = this.state

        if (isLoading || disabled) return
        this.checkFilter()
        if (!optionsInvalidate) return
        if (isAsync) {
            this.setState({isLoading: true})
            this.optionList = await this.updateRemoteOptionList()
        } else {
            this.optionList = this.updateLocalOptionList()
        }
        this.setState({isLoading: false, optionsInvalidate: false})
    }

    async updateRemoteOptionList() {
        const {remoteDataFetch = this.remoteDataFetchDefault} = this.props
        try {
            const data = await remoteDataFetch(this.props.filter)
            return check.array(data) ? data : []
        } catch (error) {
            console.log('error in Select: ', error)
        }


    }
    updateLocalOptionList() {
        return this.props.optionList
    }

    async remoteDataFetchDefault() {
        const {remoteSourceUrl, filter=[]} = this.props
        try {
            const {data} = await axios.post(remoteSourceUrl, filter)
            return check.array(data) ? data : []
        } catch (error) {
            console.log('error: ', error)
        }
    }

    buildOptionList = () => {
        const {isLoading} = this.state
        if (isLoading) return <option value={null}>Loading...</option>

        const emptyOption = <option value={this.props.emptyValue} key='empty'>{this.props.emptyLabel}</option>
        const optionsSet = this.optionList.map(
            ({value, label}, key) => {
                return <option value={value} key={key}>{label}</option>
            })
        if (this.optionList.length === 1) {
            return optionsSet
        } else {
            return this.props.emptyOption ? [emptyOption, ...optionsSet] : optionsSet
        }

    }


    render() {
        const clearMargin = this.props.clearMargin ? css.formGroupZeroMargin : undefined
        const {value} = this.state
        const controlLabel = check.string(this.props.label) ? <ControlLabel>{this.props.label}</ControlLabel> : null
        return (
            <Fragment>
                <FormGroup controlId={this.props.controlId} style={this.props.style} bsClass={clearMargin}>
                    {controlLabel}
                    <FormControl
                        onChange={this.handleChange}
                        componentClass="select"
                        placeholder="select item"
                        value={value}
                        disabled={this.props.disabled}
                        className={this.props.smallSize ? css.size : undefined}
                    >
                        {this.buildOptionList()}
                    </FormControl>
                </FormGroup>
            </Fragment>
        );
    }
    async componentDidMount() {
        await this.updateIfNeeded()
        this.setDefaultSelected(this.props.defaultSelected)
        this.checkSelected()
    }
    async componentDidUpdate() {
        await this.updateIfNeeded()
        this.setDefaultSelected(this.props.defaultSelected)
        this.checkSelected()
        this.invokeListeners()
    }
}

/**
 *
 * isAsync - if true, will be used  getDataUrl to get options list. optionList parameter will be ignored
 * onChange - function or array of functions, that will be invoke on state change
 */
Select.propTypes = {
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
    emptyOption: PropTypes.bool, //add or not empty option into list
    emptyValue: PropTypes.string,
    emptyLabel: PropTypes.string,
    defaultSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isAsync: PropTypes.bool,
    remoteSourceUrl: PropTypes.string,
    remoteDataFetch: PropTypes.func,
    onChange: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.arrayOf(PropTypes.func)
    ]),
    filter: PropTypes.arrayOf(PropTypes.shape({
        accessor: PropTypes.string,
        statement: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ])
    })),
    style: PropTypes.object,
    clearMargin: PropTypes.bool,
    smallSize: PropTypes.bool
}
Select.defaultProps = {
    emptyOption: true,
    optionList: [],
    isAsync: false,
    onChange: [],
    emptyValue: '',
    emptyLabel: '<Не выбрано>',
    filter: [],
    selected: ''
}

export default Select
