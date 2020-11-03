importScripts('/sheets.github.io/DataListManager.js')
const isDebug = true

// http://www.treegrid.com/Doc/DataUpload.htm?#XML
const TEMP_KEYS = ['Deleted', 'Changed', 'Moved', 'Added', 'Parent', 'Next', 'Prev', 'Copy', 'NewId']

// TODO: add abstraction for communication with worker by Pub/Sub pattern
// subscribe message event
self.addEventListener('message', (e) => {
    const [event, { changes, data, nestedKey, derrick }] = e.data

    switch (event) {
        case 'update':
            acceptChanges(changes, data, nestedKey, derrick)
            break
        default:
            console.debug('Worker: no event found!')
    }
})

function debug(...args) {
    if (isDebug) {
        console.log(...args)
    }
}

/**
 * Remove TreeGrid additional keys http://www.treegrid.com/Doc/DataUpload.htm?#XML
 * @param obj
 */
function removeTempKeys(obj) {
    TEMP_KEYS.forEach(key => delete obj[key])
}

function acceptChanges(changes, data, nestedKey) {
    const dataList = new DataListManager(data, nestedKey)

    changes.forEach((item) => {
        const { id, Parent, Next, Prev, Deleted, Added, Changed, Moved } = item
        debug(JSON.stringify(item, null, '\t'))
        removeTempKeys(item)

        if (Deleted) {
            dataList.removeItem(id)
        } else {
            if (Added) {
                debug('added')
                dataList.addItem(id, Parent, Next, Prev, item)
            }

            if (Moved) {
                debug('moved')
                dataList.moveItem(id, Parent, Next, Prev)
            }

            if (Changed) {
                debug('changed')
                dataList.updateItem(id, item)
            }
        }
    })

    self.postMessage(['updated', { data }])
}


