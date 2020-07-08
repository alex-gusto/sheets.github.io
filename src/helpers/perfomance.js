export default function (fn) {
    const ts = performance.now()
    try {
        fn()
    } catch (err) {
        console.log(err)
    }
    const te = performance.now()

    return (te - ts).toFixed(2)
}
