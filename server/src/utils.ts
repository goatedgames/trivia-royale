function shuffle<T>(array: T[]): void {
    let counter = array.length
    while (counter > 0) {
        const idx = Math.floor(Math.random() * counter)
        counter--
        const tmp = array[counter]
        array[counter] = array[idx]
        array[idx] = tmp
    }
}

export { shuffle }