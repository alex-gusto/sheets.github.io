self.addEventListener('message', (e) => {
    const [event, changes, data] = e.data

    switch (event) {
        case 'change':
            acceptChanges(changes, data)
            break
        default:
            console.debug('Worker: no event found!')
    }
})

function findById(root, key, uid, skip) {
    if (root[key] === uid) return root;
    for (let i in root) {
        if (skip && skip.includes(i)) continue;
        const path = root[i]
        const type = typeof path;
        if (!path || !["array", "object"].includes(type)) continue;
        const value = findById(root[i], key, uid, skip);
        if (value) return value;
    }
}

function acceptChanges(changes, data) {
    const item = findById(data, 'id', changes.id)
    if (!item) {
        self.postMessage(['error', 'Item to update not found!'])
        return
    }

    Object.entries(changes).forEach(([key, value]) => {
        item[key] = value
    })

    self.postMessage(['updated', data])
}


