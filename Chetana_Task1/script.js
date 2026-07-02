const display = document.getElementById("display");

const buttons = document.querySelectorAll("button");

let expression = "";

buttons.forEach(button => {

    button.addEventListener("click", () => {

        let value = button.innerText;

        // AC Button
        if(value === "AC"){

            expression = "";
            display.value = "0";
        }

        // Delete Button
        else if(value === "⌫"){

            expression = expression.slice(0,-1);

            if(expression === ""){
                display.value = "0";
            }
            else{
                display.value = expression;
            }
        }

        // Equal Button
        else if(value === "="){

            try{

                let result = expression
                .replace(/×/g,"*")
                .replace(/÷/g,"/")
                .replace(/−/g,"-");

                expression = eval(result).toString();

                display.value = expression;

            }catch{

                display.value = "Error";
                expression = "";
            }
        }

        // Numbers & Operators
        else{

            if(display.value === "0"){
                display.value = "";
            }

            expression += value;

            display.value = expression;
        }

    });

});