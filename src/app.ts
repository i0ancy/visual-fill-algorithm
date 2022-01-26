let myMap: number[][] = [
    [-1, 0, 0, -1, -1, -1, -1, 0],
    [0, 0, -1, -1, 0, 0, 0, 0],
    [-1, 0, -1, -1, 0, 0, -1, 0],
    [0, 0, 0, -1, 0, 0, 0, 0],
    [-1, -1, 0, -1 , -1, -1, -1, -1],
    [-1, -1, -1, -1, 0, 0, -1, 0],
    [0, 0, -1, 0, 0, -1, -1, 0],
    [-1, 0, -1, 0, 0, -1, 0, -1]
]

const mapRows = myMap.length
const mapColumns = myMap[0].length
const htmlTableID = "map"
const resetButton = <HTMLButtonElement>document.getElementById("resetButton")
const startButton = <HTMLButtonElement>document.getElementById("startButton")

enum Colors {
    Green = "#8ebf88",
    Blue = "#85bcff",
    Grey = "#b3b3b3",
    Yellow = "#faf9aa",
    Red = "#fa8c8c"
}

function arrayToMatrix(array: NodeListOf<HTMLElement>, columns: number) {
    let matrix: any[] = []
    let i: number, k: number
    for(i = 0, k = -1; i < array.length; i++) {
        if (i % columns === 0) {
            k++
            matrix[k] = []
        }
        matrix[k].push(array[i])
    }
    return matrix
}

function delay(ms: number) {
    return new Promise((resolve, reject) => { setTimeout(resolve, ms) })
}

function generateHTMLTable(tableID: string, map: number[][], rows: number, columns: number) {
    let table = <HTMLTableElement>document.getElementById(tableID)
    resetButton.disabled = true
    startButton.disabled = false
    if (table.innerHTML != "") {
        table.innerHTML = ""
        startButton.disabled = false
        resetButton.disabled = true
    }
    for(let i = 0; i < rows; i++) {
        let row = table.insertRow(i)
        for(let j = 0; j < columns; j++) {
            let cell = row.insertCell(-1)
            cell.innerHTML = map[i][j].toString()
            cell.classList.add("terrain")
            cell.style.backgroundColor = Colors.Grey
            if (+cell.innerHTML == 0) {
                cell.style.textDecoration = `underline ${Colors.Red}`
            }
        }
    }
    let myHTMLMap = arrayToMatrix(<NodeListOf<HTMLElement>>document.querySelectorAll(`#${htmlTableID} td`), mapColumns)
    return myHTMLMap
}

let myHTMLMap = generateHTMLTable(htmlTableID, myMap, mapRows, mapColumns)

function changeElementColor(element: HTMLElement, color: Colors) {
    element.style.backgroundColor = color
}

async function fill(row: number, column: number, islandNumber: number) {
    changeElementColor(myHTMLMap[row][column], Colors.Yellow)
    await delay(300)
    myHTMLMap[row][column].innerHTML = islandNumber.toString()
    changeElementColor(myHTMLMap[row][column], Colors.Green)

    // merge in stanga
    if (column > 0 && +myHTMLMap[row][column-1].innerHTML == 0) {
        await fill(row, column-1, islandNumber)
    }

    // merge in jos
    if (row < mapRows-1 && +myHTMLMap[row+1][column].innerHTML == 0) {
        await fill(row+1, column, islandNumber)
    }

    // merge in dreapta
    if (column < mapColumns-1 && +myHTMLMap[row][column+1].innerHTML == 0) {
        await fill(row, column+1, islandNumber)
    }

    // merge in sus
    if (row > 0 && +myHTMLMap[row-1][column].innerHTML == 0) {
        await fill(row-1, column, islandNumber)
    }
}

async function startAlgorithm() {
    startButton.disabled = true
    let k = 0;
    for(let i = 0; i < mapRows; i++) {
        for(let j = 0; j < mapColumns; j++) {
            if (+myHTMLMap[i][j].innerHTML == 0) {
                k++;
                changeElementColor(myHTMLMap[i][j], Colors.Yellow)
                await fill(i, j, k)  
            }
            if (+myHTMLMap[i][j].innerHTML == -1) {
                changeElementColor(myHTMLMap[i][j], Colors.Yellow)
                await delay(300)
                changeElementColor(myHTMLMap[i][j], Colors.Blue)
            }
        }
    }
    resetButton.disabled = false
}

function resetAlgorithm() {
    myHTMLMap = generateHTMLTable(htmlTableID, myMap, mapRows, mapColumns)
}