document.addEventListener('DOMContentLoaded', () => {
    const displayResult = document.querySelector('.display .result');
    const displayExpression = document.querySelector('.display .current-expression');
    const buttons = document.querySelector('.buttons');
    const themeToggleButton = document.getElementById('theme-toggle-button');

    let currentInput = '0';
    let previousInput = '';
    let operator = null;
    let newOperation = true; // Flag to indicate if a new number should replace currentInput

    function updateDisplay() {
        displayResult.textContent = currentInput;
        displayExpression.textContent = previousInput + (operator ? ` ${operator} ` : '');
    }

    function calculate() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case 'x':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            case '%': // Percentage as a unary operator (e.g., 50%) or binary (50% of 100)
                result = current / 100; // Simplified for now, can be expanded
                break;
            default:
                return;
        }
        currentInput = result.toString();
        operator = null;
        previousInput = '';
        newOperation = true;
    }

    buttons.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn')) return;

        const buttonText = e.target.textContent;

        if (e.target.classList.contains('number')) {
            if (newOperation) {
                currentInput = buttonText;
                newOperation = false;
            } else {
                if (currentInput === '0' && buttonText !== '0') {
                    currentInput = buttonText;
                } else if (currentInput !== '0' || buttonText === '0') {
                    currentInput += buttonText;
                }
            }
        } else if (e.target.classList.contains('dot')) {
            if (!currentInput.includes('.')) {
                currentInput += '.';
            }
        } else if (e.target.classList.contains('operator')) {
            if (buttonText === '+/-') {
                currentInput = (parseFloat(currentInput) * -1).toString();
            } else if (buttonText === '%') {
                 // Simple percentage calculation: current number divided by 100
                currentInput = (parseFloat(currentInput) / 100).toString();
                newOperation = true; // Result of % is a new number
            }
            else {
                if (operator && previousInput !== '') {
                    calculate(); // chained operations
                    previousInput = currentInput;
                } else {
                    previousInput = currentInput;
                }
                operator = buttonText === 'x' ? 'x' : buttonText; // Handle 'x' as multiply
                currentInput = '0'; // Reset current input for next number
                newOperation = true;
            }
        } else if (e.target.classList.contains('clear')) {
            currentInput = '0';
            previousInput = '';
            operator = null;
            newOperation = true;
        } else if (e.target.classList.contains('equals')) {
            if (operator && previousInput !== '') {
                calculate();
            }
            newOperation = true;
        } else if (e.target.classList.contains('special')) {
            // For the integral symbol, we can add a specific function later if needed.
            // For now, it will just show its text.
            displayExpression.textContent = `∫(${currentInput})`;
            // No specific calculation for 'integral' in a basic calculator, just display
            newOperation = true;
        }
        updateDisplay();
    });

    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('theme2');
    });

    updateDisplay(); // Initialize display
});