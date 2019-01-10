import axios from 'axios'
import check from 'check-types'

const RemoteDataProvider = (url) => async function (filter) {
    try {
        const {data: {rc}} = await axios.post(url, filter)
        return rc.filter(item => {
            return check.not.emptyString(item.value)
        })
    } catch (error) {
        console.log('error: ', error)
        return [{
            value: 'fetchDataError',
            label: 'Ошибка запроса данных'
        }]
    }
}

export default RemoteDataProvider