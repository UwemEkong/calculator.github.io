let displayOutput = document.querySelector("#calculation");
let currComputation = 0;
let currNum = "";
let equation = [];

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (a - Math.floor(a) != 0 || b - Math.floor(b) != 0) {
        return (a / b).toFixed(3);
    } else {
        return a / b;
    }
}

function mod(a, b) {
    return a % b;
}



const buttons = document.querySelectorAll(`.button`);

buttons.forEach(button => button.addEventListener('click', saveButtonChoice));

window.addEventListener("keydown", saveButtonChoice);



function saveButtonChoice(e) {

    let buttonChoice = "";
    if (e.type == "keydown") {
        buttonChoice = e.key;
    } else {
        buttonChoice = e.path[0].innerHTML;
    }

    if (buttonChoice != "Shift") {
        displayOutput.value = clearTrailingZero(displayOutput.value);

        // Case I: User clears the display
        if (buttonChoice == "CE") {
            displayOutput.value = "0";
            currComputation = 0;
            equation = [];
            currNum = "";
            // Case II: User chooses to evaluate the input
        } else if (buttonChoice == "=") {
            equation.push(currNum);
            currNum = "";
            updateComputation(buttonChoice);
            if (displayOutput.value != "ERROR") {
                displayOutput.value = currComputation.toString();
            }
            // Case III: User chooses to append to the input
        } else if (buttonChoice == "Backspace") {
            currNum = "";
            displayOutput.value.replace("Backspace", "");
            displayOutput.value = displayOutput.value.substring(0, displayOutput.value.length - 1);
            console.log(equation);

        } else {

            displayOutput.value += updateDisplay(displayOutput.value, buttonChoice);


            if (buttonChoice != ")" && buttonChoice != "(") {
                console.log("Equation: " + equation);
                if (isNaN(buttonChoice) == false || buttonChoice == ".") {
                    currNum += buttonChoice;
                } else {
                    if (currNum.length >= 1) {
                        equation.push(currNum);
                    }

                    updateComputation(buttonChoice);
                    currNum = "";
                }
            }
        }
    }
}
/*
 * Given an input of digits and math symbols, solve the given equation
 */
function updateComputation(choice) {
    let numA = 0;
    let numB = 0;
    let operation = "";

    if (equation.length > 1 && equation[equation.length - 1] == 0 && equation[equation.length - 2] == ["÷"]) {
        displayOutput.value = "ERROR";
        currComputation = 0;
        equation = [];
        currNum = "";
    }

    // Case I: Computing 2 integers, followed by a "+" or a "-"
    if (equation.length == 3 && choice == "=" || equation.length == 3 && choice == "+" || equation.length == 3 && choice == "-") {
        let answer = 0;


        answer = performCalculation();

        equation.push(answer.toString());
        currComputation = answer;

        // Case II: Computing 3 integers, s.t. we have at least one "mult" or "divide"
    } else if (equation.length == 5 && choice == "=") {
        let initialAnswer = 0;


        initialAnswer = performCalculation();

        finalAnswer = getFinalCalculation(initialAnswer);

        equation.push(finalAnswer.toString());
        currComputation = finalAnswer;

    } else if (equation.length == 5) {

        let answer = 0;

        answer = performCalculation();
        equation.push(answer.toString());
    } else if (equation.length <= 1 && choice == "=") {
        currComputation = equation[0];
        currNum += equation.pop();
    }
    if (choice != '=' && choice != "(" && choice != ")") {
        equation.push(choice);
    }
}

function performCalculation() {

    numA = sanitize(equation.pop());
    operation = equation.pop();
    numB = sanitize(equation.pop());

    return evaluate(numA, operation, numB);

}

function getFinalCalculation(initialAnswer) {
    operation = equation.pop();
    numB = sanitize(equation.pop());
    return evaluate(initialAnswer, operation, numB);
}

function sanitize(str) {
    if (str.includes(".")) {
        return parseFloat(str);
    } else {
        return parseInt(str);
    }
}

function evaluate(a, operator, b) {
    if (operator == "+") {
        return add(a, b);
    } else if (operator == "-") {
        return subtract(b, a);
    } else if (operator == "x") {
        return multiply(a, b);
    } else if (operator == "%") {
        return mod(b, a);
    } else {
        return divide(b, a);
    }


}

/*
 * Sanitize the display text to clear trailing zeros
 */
function clearTrailingZero(displayText) {
    if (displayText == "0") {
        displayText = "";
    }
    return displayText;
}

function updateDisplay(displayVal, buttonVal) {
    let len = displayVal.length;
    if (!isNaN(displayVal.charAt(len - 1)) && !isNaN(buttonVal)) {
        return buttonVal;
    } else {
        return " " + buttonVal;
    }
}
