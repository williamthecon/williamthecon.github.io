var currentViewCap = 0;
function viewMore() {
    currentViewCap += 50;
    // Get all table rows
    const rows = Array.from(document.querySelectorAll('.table-row:not(.table-header)'));

    // Hide all rows except the first 50
    // var madeVisible = false;
    rows.forEach((row, index) => {
        if (index <= currentViewCap && row.style.display === "") {
            row.style.display = 'table-row';
            madeVisible = true;
        }
    });

    // if (madeVisible) {
    //     sortTable();
    // }
}

let tableSorting = [1, 2, 0, 3, 4];
function setSorting(colIndex1, colIndex2, colIndex3, colIndex4, colIndex5) {
    tableSorting = [colIndex1, colIndex2, colIndex3, colIndex4, colIndex5];
    sortTable();
}

function convertToIntIfInteger(str) {
    return /^\d+$/.test(str) ? parseInt(str, 10) : str;
}

const charOrder = "abcdefghijklmnopqrstuvwxyz0123456789_-'`´@%$§€°+*~\"&/(),:;.!? "
const canBeReplaced = new Map([
    ["ä", "a"],
    ["ö", "o"],
    ["ü", "u"],
    ["ß", "s"],
    ["ø", "o"],
    ["ë", "e"],
    ["é", "e"],
    ["è", "e"],
    ["á", "a"],
    ["à", "a"],
    ["í", "i"],
    ["ì", "i"],
    ["ù", "u"],
    ["ù", "u"],
    ["ó", "o"],
    ["ò", "o"],
    ["ý", "y"],
    ["â", "a"],
    ["ā", "a"],
    ["ą", "a"],
    ["ã", "a"],
    ["æ", "a"],
    ["à", "a"],
    ["ă", "a"],
    ["å", "a"],
    ["č", "c"],
    ["ç", "c"],
    ["ď", "d"],
    ["ċ", "c"],
    ["ĉ", "c"],
    ["ɕ", "c"],
    ["ʗ", "c"],
    ["Ð", "d"],
    ["ð", "d"],
    ["ʤ", "d"],
    ["e", "e"],
    ["ė", "e"],
    ["đ", "d"],
    ["ʣ", "d"],
    ["ê", "e"],
    ["ɗ", "d"],
    ["ɖ", "d"],
    ["ʥ", "d"],
    ["ë", "e"],
    ["ě", "e"],
    ["ę", "e"],
    ["Ĝ", "g"],
    ["ĕ", "e"],
    ["ē", "e"],
    ["ɠ", "g"],
    ["ġ", "g"],
    ["ĝ", "g"],
    ["ğ", "g"],
    ["ĥ", "h"],
    ["ģ", "g"],
    ["ģ", "g"],
    ["ï", "i"],
    ["ï", "i"],
    ["ï", "i"],
    ["ĩ", "i"],
    ["i", "i"],
    ["ĭ", "i"],
    ["î", "i"],
    ["ī", "i"],
    ["ñ", "n"],
    ["ń", "n"],
    ["ņ", "n"],
    ["ň", "n"],
    ["ŏ", "o"],
    ["ô", "o"],
    ["ō", "o"],
    ["õ", "o"],
    ["ő", "o"],
    ["ř", "r"],
    ["ŗ", "r"],
    ["š", "s"],
    ["ś", "s"],
    ["ş", "s"],
    ["ŝ", "s"],
    ["ʂ", "s"],
    ["ŭ", "u"],
    ["û", "u"],
    ["ū", "u"],
    ["ũ", "u"],
    ["ű", "u"],
    ["ů", "u"],
    ["ŵ", "w"],
    ["ż", "z"],
    ["ŷ", "y"],
    ["ź", "z"],
    ["ž", "z"],
    ["ÿ", "y"],
    ["ʐ", "z"],
    ["ʑ", "z"]
])

function compareStrings(str1, str2) {
    var s1 = ""
    for (let i = 0; i < str1.length; i++) {
        var char = str1[i].toLowerCase();
        if (canBeReplaced.has(char)) {
            char = canBeReplaced.get(char);
        } else if (!charOrder.includes(char)) {
            char = "."
        }
        s1 += char;
    }

    var s2 = ""
    for (let i = 0; i < str2.length; i++) {
        var char = str2[i].toLowerCase();
        if (canBeReplaced.has(char)) {
            char = canBeReplaced.get(char);
        } else if (!charOrder.includes(char)) {
            char = "."
        }
        s2 += char;
    }

    const minLength = Math.min(s1.length, s2.length);
    for (let i = 0; i < minLength; i++) {
        const i1 = charOrder.indexOf(s1[i]);
        const i2 = charOrder.indexOf(s2[i]);

        if (i1 < i2) {
            return true;
        } else if (i1 > i2) {
            return false;
        }
    }

    if (s1.length < s2.length) {
        return true;
    } else if (s1.length > s2.length) {
        return false;
    }

    return null;
}

function compareArrays(arr1, arr2) {
    for (let n = 0; n < arr1.length; n++) {
        var a = convertToIntIfInteger(arr1[n]);
        var b = convertToIntIfInteger(arr2[n]);

        if (a === "") {
            if (b === "") {
                continue;
            }

            if (typeof b === "number") {
                a = 9.9999999e+99;
            } else {
                a = " ";
            }
        } else if (b === "") {
            if (typeof a === "number") {
                b = 9.9999999e+99;
            } else {
                b = " ";
            }
        }

        if (typeof a === 'number') {
            if (a < b) {
                return true;
            } else if (a > b) {
                return false;
            }
        } else {
            const comp = compareStrings(a, b);
            if (comp === true) {
                return true;
            } else if (comp === false) {
                return false;
            }
        }
    }

    return false;
}

function sortArray(arr) {
    var nArr = [];
    arr.forEach(item => {
        var added = false;
        nArr.forEach((nItem, index) => {
            if (!added && compareArrays(item, nItem)) {
                nArr.splice(index, 0, item);
                added = true;
            }
        });
        if (!added) {
            nArr.push(item);
        }
    });
    return nArr;
}

function sortTable() {
    // const tableCells = Array.from(document.querySelectorAll(".table-cell")).filter(cell => window.getComputedStyle(cell).display !== "none");
    const tableCells = document.querySelectorAll(".table-cell:not(.table-header)");
    const tableRows = new Set();
    const headerRow = document.querySelector(".table-header");
    tableCells.forEach(cell => {
        tableRows.add(cell.parentElement);
    });
    const tableRows2 = Array.from(tableRows);
    var importantTexts = [];

    tableRows2.forEach(row => importantTexts.push([
        convertToIntIfInteger(row.children[tableSorting[0]].textContent),
        convertToIntIfInteger(row.children[tableSorting[1]].textContent),
        convertToIntIfInteger(row.children[tableSorting[2]].textContent),
        convertToIntIfInteger(row.children[tableSorting[3]].textContent),
        convertToIntIfInteger(row.children[tableSorting[4]].textContent),
        row
    ]));

    const sortedRows = [];
    sortArray(importantTexts).forEach(info => sortedRows.push(info[5]));

    const table = document.querySelector(".table")
    table.innerHTML = "";

    table.appendChild(headerRow);

    sortedRows.forEach(row => {
        table.appendChild(row);
    });
}

// const tableRows = document.querySelectorAll('.table-row');

// tableRows.forEach(tableRow => {
//     tableRow.addEventListener('mousedown', (event) => {
//         if (event.button === 0) {
//             // Left mouse button clicked
//             console.log('Left mouse button clicked');
//         } else if (event.button === 2) {
//             // Right mouse button clicked
//             console.log('Right mouse button clicked');
//         }
//     });

//     tableRow.addEventListener('touchstart', (event) => {
//         if (event.touches.length === 1) {
//             // Single touch
//             console.log('Single touch');
//         } else if (event.touches.length === 2) {
//             // Double touch
//             console.log('Double touch');
//         }
//     });

//     // Prevent the context menu from showing up on right-click
//     tableRow.addEventListener('contextmenu', (event) => {
//         event.preventDefault();
//     });
// });
