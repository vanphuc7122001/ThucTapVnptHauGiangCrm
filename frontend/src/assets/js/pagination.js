export const toString = (items) => {
    return items.map(
        (value, index) => {
            const keys = Object.keys(value);
            const values = keys.map(
                (value1, index1) => {
                    return value[value1];
                }
            )
            return values.join("").toLocaleLowerCase();
        }
    )
}

export const _filter = (items, searchText) => {
    return items.filter(
        (value, index) => {
            return toString(items)[index].includes(
                searchText.toLocaleLowerCase()
            )
        }
    )
}

