
import { useReducer } from "react";
import { DigitButton } from "./digitButton";
import { type } from "@testing-library/user-event/dist/type";
import { OperationButton } from "./OperationButton";

export const ACTIONS = {
    ADD_DIGIT: "add-digit",
    CLEAR: "clear",
    DELETE_DIGIT: "delete-digit",
    EVALUATE: "evaluate",
    CHOOSE_OPERATION: "choose-operation"
}

function reducer(state, { type, payload }) {
    // eslint-disable-next-line default-case
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: payload.digit
                }
            }
            if (payload.digit === "0" && state.currentOperand === "0") return state;
            if (payload.digit === "." && state.currentOperand.includes(".")) return state;
            return {
                ...state,
                currentOperand: `${state.currentOperand || ""}${payload.digit}`,
            }

        case ACTIONS.CLEAR:
            return {
                currentOperand: null,
                previousOperand: null
            }

        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null
                }
            }
            if (state.currentOperand.length === 1) {
                return {
                    ...state,
                    currentOperand: null
                }
            }
            if (state.currentOperand.length !== 0) {
                return {
                    ...state,
                    currentOperand: state.currentOperand.slice(0, -1)
                }
            }
            if (state.currentOperand.length === 0) {
                return {
                    ...state,
                    currentOperand: null,
                    previousOperand: state.previousOperand
                }
            }
            break

        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand == null && state.previousOperand == null) return state;

            if (state.currentOperand == null && state.previousOperand != null) {
                return {
                    ...state,
                    operation: payload.operation,
                };
            }

            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }

            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null
            }
        case ACTIONS.EVALUATE:
            if (state.operation == null || state.previousOperand == null || state.currentOperand == null) {
                return state;
            }

            return {
                ...state,
                operation: null,
                overwrite: true,
                previousOperand: null,
                currentOperand: evaluate(state)
            }



    }

}

const evaluate = ({ previousOperand, currentOperand, operation }) => {
    const prev = parseFloat(previousOperand);
    const curr = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(curr)) return " "

    let Computation = " "
    switch (operation) {
        case "+":
            Computation = prev + curr;
            break;

        case "*":
            Computation = prev * curr;
            break;

        case "-":
            Computation = prev - curr;
            break;

        case "÷":
            Computation = prev / curr;
            break;
        default:
            break;
    }

    return Computation.toString();
}

export const Calculator = () => {
    const [{ currentOperand, operation, previousOperand }, dispatch] = useReducer(reducer, {})

    return (<>
        <div className="Calculator-Grid">
            <div className="Output">
                <div className="previous-operand">{previousOperand} {operation} </div>
                <div className="current-operand">{currentOperand}</div>
            </div>
            <button className="two-span" onClick={() => dispatch({ type: ACTIONS.CLEAR })}> AC</button>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
            <OperationButton operation="÷" dispatch={dispatch} />
            <DigitButton digit="7" dispatch={dispatch} />
            <DigitButton digit="8" dispatch={dispatch} />
            <DigitButton digit="9" dispatch={dispatch} />
            <OperationButton operation="*" dispatch={dispatch} />
            <DigitButton digit="4" dispatch={dispatch} />
            <DigitButton digit="5" dispatch={dispatch} />
            <DigitButton digit="6" dispatch={dispatch} />
            <OperationButton operation="+" dispatch={dispatch} />
            <DigitButton digit="1" dispatch={dispatch} />
            <DigitButton digit="2" dispatch={dispatch} />
            <DigitButton digit="3" dispatch={dispatch} />
            <OperationButton operation="-" dispatch={dispatch} />
            <DigitButton digit="." dispatch={dispatch} />
            <DigitButton digit="0" dispatch={dispatch} />
            <button className="two-span" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
        </div>
    </>);
}

export default Calculator;