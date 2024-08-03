const STATE_ERROR = -1;
const STATE_START = 0;
const STATE_OPERAND_1 = 1; // Operand 1 is being entered
const STATE_OPERATOR = 2;  // Operand 1 and operator have been entered
const STATE_OPERAND_2 = 3; // Operand 2 is being entered

const OP_ADD = 0;
const OP_SUBTRACT = 1;
const OP_MULTIPLY = 2;
const OP_DIVIDE = 3;

const MAX_DISPLAY = 15;  // Maximum number of characters to display

let state = STATE_START;
let displayValue = 0;
let operand1 = null;
let operand2 = null;
let operator = null;

const display = document.querySelector(".display");

function respondToDigit(digit) {
    switch (state) {
        case STATE_START:
            displayValue = digit;
            state = STATE_OPERAND_1;
            break;
        case STATE_OPERATOR:
            displayValue = digit;
            state = STATE_OPERAND_2;
            break;
        case STATE_OPERAND_1:
        case STATE_OPERAND_2:
            displayValue = 10 * displayValue + digit;
            break;
        case STATE_ERROR:
            break;
        default:
            console.log(`ERROR: Reached an invalid state ${state}.`);
    }
    displayResult();
}

function respondToOperator(op) {
    switch (state) {
        case STATE_START:
        case STATE_OPERAND_1:
            operand1 = displayValue;
            operator = op;
            state = STATE_OPERATOR;
            break;
        case STATE_OPERATOR:
            operator = op;
            break;
        case STATE_OPERAND_2:
            operand2 = displayValue;
            displayValue = operate();
            operand1 = displayValue;
            operand2 = null;
            operator = op;
            state = STATE_OPERATOR;
            break;
        case STATE_ERROR:
            break;
        default:
            console.log(`ERROR: Reached an invalid state ${state}.`);
    }
    displayResult();
}

function respondToEqual() {
    if (state == STATE_ERROR) return;

    if (state == STATE_OPERAND_2) {
        operand2 = displayValue;
        displayValue = operate();
    }
    operand1 = null;
    operand2 = null;
    operator = null;
    state = STATE_START;

    displayResult();
}

function respondToClear() {
    displayValue = 0;
    operand1 = null
    operand2 = null;
    operator = null;
    state = STATE_START;

    displayResult();
}

function displayResult() {
    if (Math.abs(displayValue) >= 10 ** MAX_DISPLAY) {
        display.textContent = "Value too large";
        state = STATE_ERROR;
    }
    else {
        display.textContent = displayValue.toString()
                                          .substring(0, MAX_DISPLAY);
    }
}

function operate() {
    switch (operator) {
        case OP_ADD:
            return operand1 + operand2;
        case OP_SUBTRACT:
            return operand1 - operand2;
        case OP_MULTIPLY:
            return operand1 * operand2;
        case OP_DIVIDE:
            return operand1 / operand2;
        default:
            console.log(`ERROR: Operator ${operator} is invalid.`);
    }
}

for (let d = 0; d <= 9; d++) {
    document.querySelector(`.button.digit-${d}`)
            .addEventListener("click", () => respondToDigit(d));
}

document.querySelector(".button.operator-add")
        .addEventListener("click", () => respondToOperator(OP_ADD));

document.querySelector(".button.operator-subtract")
        .addEventListener("click", () => respondToOperator(OP_SUBTRACT));

document.querySelector(".button.operator-multiply")
        .addEventListener("click", () => respondToOperator(OP_MULTIPLY));

document.querySelector(".button.operator-divide")
        .addEventListener("click", () => respondToOperator(OP_DIVIDE));

document.querySelector(".button.equal")
        .addEventListener("click", respondToEqual);

document.querySelector(".button.clear")
        .addEventListener("click", respondToClear);

