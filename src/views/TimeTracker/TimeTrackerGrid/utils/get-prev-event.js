export default function getPrevEvent(grid, row) {
    const _row = grid.GetPrev(row)

    if (!_row) return

    if (_row.Def.Name !== 'Event') {
        return getPrevEvent(grid, _row)
    }

    return _row
}
