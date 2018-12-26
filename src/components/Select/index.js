import React, { PureComponent, Fragment} from 'react'
import PropTypes from 'prop-types'
import {FormControl, ControlLabel, FormGroup} from 'react-bootstrap'
import check from 'check-types'
import axios from "axios"

class Select extends PureComponent {

    state = {
        selected: check.number ? this.props.selected.toString() : this.props.selected,
        isLoading: false,
        optionList: [],
        optionsInvalidate: true,
    }

    filter = {}

    handleChange = (e) => {
        console.log(('change select'))
        this.setState({selected: e.target.value})
    }


    invokeListeners = () => {
        console.log('invoke', this.state.selected)
        let {onChange} = this.props
        if (check.function(onChange)) {
            onChange = [onChange]
        }
        if (check.not.array(onChange)) return
        for (const subscriber of onChange) {
            subscriber(Object.assign({}, this.state))
        }
    }

    filterShouldUpdate() {
        return JSON.stringify(this.filter) !== JSON.stringify(this.props.filter)
    }

    async updateIfNeeded() {
        if (!this.state.optionsInvalidate || this.state.isLoading || this.props.disabled) return

        const {isAsync, filter} = this.props
        if (this.filterShouldUpdate()) {
            this.filter = filter
        }
        let updatedList
        if (isAsync) {
            this.setState({isLoading: true})
            updatedList = await this.updateRemoteOptionList()
            console.log('remote list is updated')
        } else {
            updatedList = this.updateLocalOptionList()
        }
        const selected = this.validateSelectedValue(updatedList) ? this.state.selected : ''
        // const selected = ''
        this.setState({isLoading: false, optionsInvalidate: false, optionList: updatedList, selected})
    }

    async updateRemoteOptionList() {
        const {getRemoteData} = this.props
        try {
            const data = await getRemoteData()
            return check.array(data) ? data : []
        } catch (error) {
            console.log('error in Select: ', error)
        }

        const {remoteSourceUrl} = this.props
        try {
            const {data} = await axios.post(remoteSourceUrl)
            console.log(data)
            return []
        } catch (error) {
            console.log('error: ', error)
        }
    }

    updateLocalOptionList() {
        return this.props.optionList
    }

    validateSelectedValue(optionList) {
        const {selected} = this.state
        const filtered = optionList.filter((item) => {
            return item.value.toString() === selected
        })
        return filtered.length > 0
    }

    buildOptionList = () => {
        const {optionsInvalidate, optionList} = this.state

        if (optionsInvalidate) return []

        return optionList.map(
            ({value, label}, key) => {
                return <option value={value} key={key}>{label}</option>
            }
        )
    }

    render() {
        const optionList = (() => {
            const {selected, isLoading} = this.state
            const {placeHolder} = this.props
            if (isLoading) {
                return <option value={null}>Loading...</option>
            } else {
                const list = this.buildOptionList()
                if (check.emptyString(selected)) {
                    list.unshift(<option value={selected} key={list.length}>{placeHolder}</option>)
                }
                return list
            }
        })()

        const controlLabel = check.not.emptyString(this.props.label) ? <ControlLabel>{this.props.label}</ControlLabel> : null
        return (
            <Fragment>
                <FormGroup controlId={this.props.controlId}>
                    {controlLabel}
                    <FormControl
                        onChange={this.handleChange}
                        componentClass="select"
                        placeholder="select item"
                        value={this.state.selected}
                        disabled={this.props.disabled}
                    >
                        {optionList}
                    </FormControl>
                </FormGroup>
            </Fragment>
        );
    }
    async componentDidMount() {
        console.log('didMounted')
        // await this.updateIfNeeded()
    }
    async componentDidUpdate() {
        console.log('didUpdated')
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
    placeHolder: PropTypes.string,
    selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isAsync: PropTypes.bool,
    remoteSourceUrl: PropTypes.string,
    getRemoteData: PropTypes.func,
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
    subscribers: [],
    selected: '',
    placeHolder: 'Select',
    filter: {},
    getRemoteData: () => {}
}

export default Select
