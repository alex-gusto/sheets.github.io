function createFlatter() {
    let globalIndex = -1

    return function flatData(data, newData = [], groups = []) {
        data.forEach(row => {
            newData.push(row)
            globalIndex++

            if (row.__children) {
                groups.push({
                    index: globalIndex,
                    count: row.__children.length
                })
                flatData(row.__children, newData, groups)
                delete row.__children
            }
        })

        return { data: newData, groups }
    }
}


export default createFlatter
