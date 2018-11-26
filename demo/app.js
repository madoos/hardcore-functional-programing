import conf from './src/config'
import {asIO, eventAsStream, mapS, runIO, fork} from './src/utils'
import {path, compose, concat, map, prop} from 'ramda'
import {stringify as toQuerystring} from 'querystring'
import http from './src/http'
import html from './src/html'
import {Maybe} from 'monet'

////////////////////////// Dom //////////////////////////////////////

// getDom :: String -> IO Dom
const getDom = asIO(html.bySelector)

////////////////////////// stream source //////////////////////////////////////

// listenKeyup :: String -> Stream event
const listenKeyup = eventAsStream('keyup')

// listenClick :: String -> Stream event
const listenClick = compose(
    mapS(prop('target')),
    eventAsStream('click')
)

////////////////////////// Handle input search //////////////////////////////////////

// termToUrl :: String -> URL
const termToUrl = term =>
    concat(
        conf.SEARCH_URL,
        toQuerystring({
            part : 'snippet',
            q    : term,
            key  : conf.API_KEY
        })
    )

// searchUrl :: Event -> URL
const searchUrl = compose(
    termToUrl,
    path(['target', 'value'])
)

// streamUrls :: Dom -> Stream Url
const streamUrls = compose(
    mapS(searchUrl),
    listenKeyup
)

//  searchStream :: Dom -> Stream Tasks
const searchStream = compose(
    mapS(http.get),
    streamUrls
)

// getLiItems :: Entry -> [Dom]
const getLiItems = compose(
    map(html.createVideoLi),
    path(['data', 'items'])
)

////////////////////////// Handle select video //////////////////////////////////////

// getYoutobeId :: Dom -> String | undefined
const getYoutobeId = html.getData('data-youtubeid')

// safeCreateVideoPlayer :: Dom -> Maybe VideoPlayer
const safeCreateVideoPlayer = compose(
    map(html.createVideoPlayer),
    Maybe.of,
    getYoutobeId
)

////////////////////////// Program //////////////////////////////////////

// searchResultsFromInput :: String -> IO Steam Task
const searchResultsFrom = compose(
    map(searchStream),
    getDom
)

// selectVideo :: String -> IO Steam Dom
const selectVideoFrom = compose(
    map(listenClick),
    getDom
)

////////////////////////// impure //////////////////////////////////////

const renderResults = compose(
    html.render('#results'),
    getLiItems
)

const renderAsyncResults = fork(console.error, renderResults)

const renderVideo = compose(
    map(html.render('#player')),
    safeCreateVideoPlayer
)

// videoPlayer :: [Char] -> Future Maybe [CatVideo]
const videoPlayer = () => {
    runIO(searchResultsFrom('#search')).subscribe(renderAsyncResults)
    runIO(selectVideoFrom('#results')).subscribe(renderVideo)
}

export default videoPlayer
