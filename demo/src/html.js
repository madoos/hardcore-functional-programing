import $ from 'jquery'
import {curry, path, replace} from 'ramda'

// bySelector :: String -> Dom
const bySelector = selector => $(selector)

// createVideoLi :: Entry -> Dom
const createVideoLi = e =>
    $('<li/>', {text : e.snippet.title, 'data-youtubeid' : e.id.videoId})

// createVideoPlayer :: String -> Dom
const createVideoPlayer = id =>
    `<iframe width="320" height="240" src="//www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>`

// getData :: String -> String | undefined
const getData = curry((name, elt) => {
    const prop = replace('data-', '', name)
    return path(['dataset', prop], elt)
})

// render :: String -> Dom | [Dom] -> void
const render = curry((sel, data) => $(sel).html(data))

const html = {
    bySelector,
    createVideoLi,
    createVideoPlayer,
    getData,
    render
}

export default html
