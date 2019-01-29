import axios from 'axios'
import check from 'check-types'

const RemoteDataProvider = (url, key) => async function (filter) {
    try {
        const {data} = await axios.post(url, filter)
        return data[key].filter(item => {
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