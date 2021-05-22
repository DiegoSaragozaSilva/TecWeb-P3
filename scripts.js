let num_lines = 0;

function construct_variable_div(name, value) {
    var div = document.createElement("div");
    div.className = "variable-container w-90";

    var v_name = document.createElement("p");
    var v_value = document.createElement("p");
    
    v_name.innerHTML = name + ' =';

    v_value.innerHTML = value;

    v_name.className = "variable-name m-2";
    v_value.className = "variable-description text-break ms-4 w-75";

    div.appendChild(v_name);
    div.appendChild(v_value);

    document.getElementById("output-container-id").appendChild(div);
}
async function load_pyodide() {
    await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/" }).then(() => {
    });
}

function get_variables() {
    var globals = Array.from(pyodide.globals.toJs());
    var globals_user = globals.slice(154, globals.length);

    console.log(globals_user);

    for(let i = 0; i < globals_user.length; i++){
        construct_variable_div(globals_user[i][0], globals_user[i][1]);
    }
}

function send_python_code(code) {
    pyodide.runPython(code);
}

function add_line_to_console(code) {
    var line = document.createElement("p");
    line.className = "text-white pl-1";
    line.innerHTML = "[" + num_lines + "]" + "\t" + code;

    document.getElementById("console-prompt").appendChild(line);
    
    num_lines++;
}

function clear_input() {
    document.getElementById("console-command-input").value = "";
}

function clear_workspace() {
    var divs = document.getElementsByClassName("variable-container");

    while(divs[0]) {
        divs[0].parentNode.removeChild(divs[0]);
    }
}

// Events
document.getElementById("console-command-input").addEventListener("keyup", function(event) {
    if (event.code == 'Enter') {
        event.preventDefault()

        let code = document.getElementById("console-command-input").value;

        send_python_code(code);

        add_line_to_console(code);

        clear_input();

        clear_workspace();

        get_variables();
    }
});

load_pyodide();

