const display = document.getElementById("display") as HTMLElement | null;

if (!display) {
    throw new Error("Display element not found");
}

let displayValue = "0"; 
let expression: (string | number)[] = [];
let currentOperator = ""; 
let resultCalculated = false;

function updateDisplay(value: string) {
    display!.textContent = value;
}

function clearAll() {
    displayValue = "0";
    expression = [];
    currentOperator = "";
    resultCalculated = false;
    updateDisplay(displayValue);
}


function handleNumber(number: string) {
    if (displayValue === "Error") {
        return;
    }

    if (resultCalculated) {
        // If a result was just calculated, start a new expression
        displayValue = number;
        resultCalculated = false;
    } else if (displayValue === "0" || currentOperator) {
        displayValue = number;
    } else {
        displayValue += number;
    }
    currentOperator = "";
    updateDisplay(displayValue);
}

function handleOperator(operator: string) {
    if (displayValue === "Error") {
        return;
    }

    if (currentOperator) {
        expression.pop(); // Replace the previous operator
    } else {
        expression.push(parseFloat(displayValue)); // Push the last number to the expression
    }

    if (resultCalculated) {
        expression = [parseFloat(displayValue)];
        resultCalculated = false;
    }

    expression.push(operator);
    currentOperator = operator;
}



function calculate() {
    if (displayValue === "Error" || currentOperator) return;
    expression.push(parseFloat(displayValue)); // Push the last number to the expression

    let result = evaluateExpression(expression);

    if (result === "Error") {
        displayValue = "Error";
        expression = [];
    } else {
        displayValue = result.toString();
        expression = [result as number]; // Reset the expression to the result
    }

    resultCalculated = true;
    updateDisplay(displayValue);
}


function evaluateExpression(exp: (string | number)[]): number | string {
    let result = exp[0] as number;

    for (let i = 1; i < exp.length; i += 2) {
        const operator = exp[i];
        const nextNumber = exp[i + 1] as number;

        switch (operator) {
            case "+":
                result += nextNumber;
                break;
            case "−":
                result -= nextNumber;
                break;
            case "×":
                result *= nextNumber;
                break;
            case "÷":
                if (nextNumber === 0) {
                    return "Error"; // Return error if user try to divide by zero
                }
                result /= nextNumber;
                break;
            default:
                return result;
        }
    }

    return result;
}


function handleButtonClick(event: Event) {
    const target = event.target as HTMLButtonElement;
    const action = target.dataset.action;
    const buttonText = target.textContent;

    if (!action) {
        handleNumber(buttonText!);
    } else if (action === "clear") {
        clearAll();
    } else if (action === "equals") {
        calculate();
    } else {
        handleOperator(buttonText!);
    }
}

document.querySelectorAll(".calculator__button").forEach(button => {
    button.addEventListener("click", handleButtonClick);
});

clearAll(); // Initialize the display
