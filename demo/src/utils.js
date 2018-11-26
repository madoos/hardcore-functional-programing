import {curryN, curry} from 'ramda'
import {IO} from 'monet'
import {fromEvent} from 'rxjs'
import {map} from 'rxjs/operators'

// asIO :: (a -> b) -> (a -> IO b)
const asIO = f => curryN(f.length, (...args) => IO(() => f(...args)))

// eventAsStream :: String -> Dom -> Stream events
const eventAsStream = curry((event, domEl) => fromEvent(domEl, event))

// runIO = IO -> sideEffect
const runIO = io => io.run()

// mapS = a -> b -> S a -> S b
const mapS = curry((f, stream) => stream.pipe(map(f)))

// asTask :: FutureConstructor -> ((a, ...) -> Promise b) -> (a, ...) -> FutureConstructor b
const asTask = curry((TaskConstructor, f) =>
    curryN(f.length, (...args) => {
        return new TaskConstructor((reject, resolve) =>
            f(...args)
                .then(resolve)
                .catch(reject)
        )
    })
)

// fork :: (a -> b) -> Task e a
const fork = curry((error, success, task) => task.fork(error, success))

export {asIO, eventAsStream, runIO, mapS, asTask, fork}
