const exists = val => val !== undefined && val !== null

const Nothing = val => ({
    val     : val,
    map     : () => Nothing(val),
    chain   : () => val,
    inspect : () => `Nothing(${val})`
})

const Maybe = val => ({
    val     : val,
    map     : f => (exists(val) ? Maybe(f(val)) : Nothing(val)),
    chain   : f => f(val),
    inspect : () => `Maybe(${val})`
})

Maybe.of = val => Maybe(val)

module.exports = Maybe
