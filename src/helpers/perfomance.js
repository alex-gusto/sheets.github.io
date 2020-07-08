export default function (fn) {
    const ts = performance.now()
    fn()
    const te = performance.now()

    return (te - ts).toFixed(2)
}
