export default function getNextEvent(grid, row) {
    const _row = grid.GetNext(row)

    if (!_row) return

    if (_row.Def.Name !== 'Event') {
        return getNextEvent(grid, _row)
    }

    return _row
}
