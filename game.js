const getDimensions = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const width = urlParams.get("width");
    const height = urlParams.get("height");
    const bombCount = urlParams.get("bombs");
    return { width, height, bombCount };
}

window.onload = () => {
    const game = document.getElementById("game");
    const { width, height, bombCount } = getDimensions();

    if (!width || !height || !bombCount) {
        document.getElementById("presets").style.display = "initial";
        return;
    }

    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            game.innerHTML += `<div class="cell" id="${i}-${j}" onclick="clickCell(${i}, ${j})"></div>`;
        }
        game.innerHTML += "<br>";
    }

    for (let i = 0; i < bombCount; i++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const cell = document.getElementById(`${x}-${y}`);
        cell.classList.add("bomb");
    }
}

const clickCell = (x, y) => {
    const cell = openCell(x, y);

    if (cell.innerText === "") {
        for (let j = y - 1; j <= y + 1; j++) {
            for (let i = x - 1; i <= x + 1; i++) {
                const cell = document.getElementById(`${i}-${j}`);
                if (cell && !cell.classList.contains("open")) {
                    clickCell(i, j);
                }
            }
        }
    }

    if (cell.classList.contains("bomb")) {
        alert("Dead 💀");
        revealAll();
    }
    if (isWon()) {
        alert("Win!");
        revealAll();
    }
}

const openCell = (x, y) => {
    const cell = document.getElementById(`${x}-${y}`);
    if (cell.classList.contains("open")) {
        return;
    }
    cell.classList.add("open");
    cell.innerText = getBombCount(x, y);
    return cell;
}

const getBombCount = (x, y) => {
    if (document.getElementById(`${x}-${y}`).classList.contains("bomb")) {
        return "X";
    }
    let count = 0;
    for (let j = y - 1; j <= y + 1; j++) {
        for (let i = x - 1; i <= x + 1; i++) {
            const cell = document.getElementById(`${i}-${j}`);
            if (cell && cell.classList.contains("bomb")) {
                count++;
            }
        }
    }
    return count == 0 ? "" : count;
}

const isWon = () => {
    const cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (cell.classList.contains("bomb") === cell.classList.contains("open")) {
            return false;
        }
    }
    return true;
}

const revealAll = () => {
    const { width, height } = getDimensions();
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            openCell(i, j);
        }
    }
}
