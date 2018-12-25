import React, { PureComponent, Fragment} from 'react'
import PropTypes from 'prop-types'
import {FormControl, ControlLabel, FormGroup} from 'react-bootstrap'
import check from 'check-types'

class Select extends PureComponent {

    state = {
        selected: check.number ? this.props.selected.toString() : this.props.selected,
        // selected: this.props.selected,
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
        if (!this.state.optionsInvalidate || this.state.isLoading) return

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
        this.setState({isLoading: false, optionsInvalidate: false, optionList: updatedList, selected})
    }

    async updateRemoteOptionList() {
        //    for test only
        function timeout(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }

        await timeout(3000)
        return this.props.optionList
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
            ({value, title}, key) => {
                return <option value={value} key={key}>{title}</option>
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
                        {optionList}
                    </FormControl>
                </FormGroup>
            </Fragment>
        );
    }
    async componentDidMount() {
        console.log('didMounted')
        await this.updateIfNeeded()
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
    filter: {}
}

export default Select
