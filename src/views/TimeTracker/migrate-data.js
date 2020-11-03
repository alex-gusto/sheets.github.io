import { v4 as uuid } from 'uuid/wrapper.mjs'
import camelCase from 'lodash/camelCase'

const ignoreKeys = ['uid', '__children', 'derivedActualDepth', 'derivedPlannedDepth', 'overriddenStart', 'iltHours', 'tftHours', 'behindHours', 'end', 'actualHoursValidation']

function splitDerrickTypes(acc, item) {
    const main = {
        id: item.uid || item.id || uuid(),
        name: item.name,
        code: item.code
    }
    const aux = {
        id: uuid(),
        name: item.auxName,
        code: item.auxCode
    }

    acc[0].push(main)
    acc[1].push(aux)

    if (item.__children && item.__children.length) {
        const [mainChildren, auxChildren] = item.__children.reduce(splitDerrickTypes, [[], []])

        main.Items = mainChildren
        aux.Items = auxChildren

        return acc
    }

    Object.entries(item).forEach(([key, value]) => {
        if (ignoreKeys.includes(key)) return

        if (/^aux/.test(key)) {
            const newKey = camelCase(key.replace('aux', ''))
            aux[newKey] = value
            return
        }

        if (key === 'start' && (value || item.overriddenStart)) {
            main[key] = +new Date(value || item.overriddenStart)
            return
        }

        main[key] = value
    })

    return acc
}

export default (phases) => {
    if (!phases) return [[], []]

    return phases.reduce(splitDerrickTypes, [[], []])
}



