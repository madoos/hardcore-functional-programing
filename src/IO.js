const IO = fnEffect => ({
    fnEffect,
    map   : f => IO(val => f(fnEffect(val))),
    chain : f =>
        IO(fnEffect)
            .map(f)
            .run(),
    run     : val => fnEffect(val),
    inspect : `IO(fnEffect)`
})

IO.of = f => IO(f)

module.exports = IO
