// const {Maybe, IO} = require('../src')
const Task = require('data.task')
const {Maybe, IO} = require('monet')
const {
    curryN,
    compose,
    prop,
    chain,
    tap,
    concat,
    map,
    identity
} = require('ramda')

const asMaybe = f => curryN(f.length, (...args) => Maybe.of(f(...args)))
const safeGet = asMaybe(prop) //curry((key, obj) => Maybe(prop(key, obj)))

/*
Exercise 1
==========
Use safeGet and mjoin or chain to safetly get the street name
*/

const user = {
    id      : 2,
    name    : 'Albert',
    address : {street : {number : 22, name : 'Walnut St'}}
}

const getStreetName = compose(
    chain(safeGet('name')),
    chain(safeGet('street')),
    safeGet('address')
)

console.log('Solution ex1: ', getStreetName(user).chain(identity))

/*
Exercise 2
==========
Use monads to get the href, then purely log it.
*/

const location = {href : 'https://jsbin.com/sixulelago/edit?html'}
const asIO = f => curryN(f.length, (...args) => IO(() => f(...args)))
const runIO = io => io.run()
const getHref = asIO(() => location.href)
const pureLog = asIO(tap(console.log))

const logHref = compose(
    chain(pureLog),
    map(concat('Solution ex2: ')),
    getHref
)

runIO(logHref())

/*
Exercise 3
==========
Use monads to first get the Post with getPost(), then pass it's id in to getComments()
*/

const asTask = f =>
    curryN(f.length, (...args) => {
        return new Task((reject, resolve) =>
            f(...args)
                .then(resolve)
                .catch(reject)
        )
    })

const getPost = asTask(id =>
    Promise.resolve({id, name : 'Monads', description : 'Monads exercises'})
)

const getComments = asTask(postId => {
    const comments = [
        'Monet is a library designed to bring great power to your JavaScript programming.',
        ' It is a tool bag that assists Functional Programming by providing a rich set of Monads and other useful functions.'
    ]
    return Promise.resolve(
        comments.map((comment, i) => ({postId, id : ++i, comment}))
    )
})

// getCommentsByPost :: Number -> Task [coments]
const getCommentsByPost = compose(
    chain(
        compose(
            getComments,
            prop('id')
        )
    ),
    getPost
)

getCommentsByPost(1).fork(console.log, comments =>
    console.log('Solution ex3: ', comments)
)
