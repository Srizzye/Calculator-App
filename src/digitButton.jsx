import { ACTIONS } from "./Calculator";
import Calculator from "./Calculator";
 
export const DigitButton = ({digit,dispatch}) => {
    return(
        <button onClick={()=> dispatch({ type:ACTIONS.ADD_DIGIT, payload:{digit}})}>{digit}</button>
    );


}
