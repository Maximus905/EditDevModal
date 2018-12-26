import React from 'react'
import PropTypes from 'prop-types'
import Select from '../Select'
import axios from 'axios'
import check from 'check-types'

const Region = props => {
    const {remoteSourceUrl, label, controlId, placeHolder, filter={'filter2': 'test'}} = props
    let {selected} = props
    const updateOptionList = async () => {
        // return []
        console.log('filter: ', filter)
        try {
            const {data: {rc}} = await axios.post(remoteSourceUrl, filter)
            console.log('office data',rc)
            return rc.map(item => {
                return check.emptyString(item.value) ? {value: 'empty', label: '<Нет>'} : item
            })
        } catch (error) {
            console.log('error: ', error)
            selected = 'fetchDataError'
            return [{
                value: 'fetchDataError',
                label: 'Ошибка запроса данных'
            }]
        }
    }
    return (
        <Select {...props} label={label} controlId={controlId} selected={selected} placeHolder={placeHolder} isAsync getRemoteData={updateOptionList} />
    )
}

Region.propTypes = {
    controlId: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    placeHolder: PropTypes.string,
    selected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    remoteSourceUrl: PropTypes.string,
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
Region.defaultProps = {
    label: 'Регион',
    controlId: 'regCenterSelector',
    remoteSourceUrl: 'http://netcmdb-loc.rs.ru:8082/api/getRegions.json',
    placeHolder: 'Select region',
    selected: ''
}

export default Region
