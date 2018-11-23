import axios from 'axios'
import Task from 'data.task'
import {asTask} from './utils'

const asDataTask = asTask(Task)

const http = {
    // get :: (a...) -> Task e b
    get : asDataTask(axios.get)
}

export default http
