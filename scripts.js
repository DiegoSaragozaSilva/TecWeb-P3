import autosize from "./autosize.js"

let num_lines = 0;
let keys_pressed = {};

let key_words = ["def", "for", "while", "else", "elif", "if", "with"];
let selected_vars_names = ["cb7e52b21171fb9a53b498202607f0bd", "MTISGR", "np", "plt", "sns", "pd", "io", "base64"]

async function load_pyodide() {
    document.getElementsByClassName("console-command-line")[0].style.visibility = "hidden";
    await loadPyodide({ 'indexURL' : "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/" }).then(() => {
        pyodide.loadPackage(["numpy", "matplotlib"]).then(() => {
            document.getElementsByClassName("console-command-line")[0].style.visibility = "visible";
            document.getElementById("loading-inform").remove();
            pyodide.runPython(`
                import io, base64
                import numpy as np
                import matplotlib.pyplot as plt`
          );
        });
    });
}

function construct_variable_div(name, value) {
    if (value.length >= 50) {
        let value_trim = String(value).substring(0, 50);
        value_trim += "...";
        value = value_trim;
    }

    if (!selected_vars_names.includes(name)){
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
}

function get_variables() {
    var globals = Array.from(pyodide.globals.toJs());
    var globals_user = globals.slice(154, globals.length);

    for(let i = 0; i < globals_user.length; i++){
        construct_variable_div(globals_user[i][0], globals_user[i][1]);
    }
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

function send_python_code(code) {
    pyodide.runPython(code);
    if (code.includes('plt.show()')) {
        pyodide.runPython(`
                cb7e52b21171fb9a53b498202607f0bd = io.BytesIO()
                plt.savefig(cb7e52b21171fb9a53b498202607f0bd, format='png')
                cb7e52b21171fb9a53b498202607f0bd.seek(0)
                MTISGR = 'data:image/png;base64,' + base64.b64encode(cb7e52b21171fb9a53b498202607f0bd.read()).decode('UTF-8')
                plt.clf()`
          );

        var img = document.createElement("img");
        img.src = pyodide.globals.MTISGR;
        img.className = "variable-description text-break ms-4 w-75";

        document.getElementById("graph-container-id").appendChild(img);
    }
}

function add_code_to_console(code) {
    let c_p = document.createElement('p');

    c_p.innerHTML = "[" + num_lines + "]" + " " + code;
    c_p.className = "console-code text-white p-1";
    
    document.getElementById("console-prompt").appendChild(c_p);

    num_lines++;
}

// Events
document.getElementById("console-command-input").addEventListener("keydown", function(event) {
    keys_pressed[event.key] = true;

    if (keys_pressed['Shift'] && event.key == 'Enter') {
        event.preventDefault();
        
        let code = document.getElementById("console-command-input").value;

        send_python_code(code);

        add_code_to_console(code);

        clear_input();

        clear_workspace();

        get_variables();
    }

    else if (event.code == 'Tab') {
        event.preventDefault();

        var start = this.selectionStart;
        var end = this.selectionEnd;

        this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);

        this.selectionStart =
        this.selectionEnd = start + 1;
    }
});

document.getElementById("console-command-input").addEventListener("keyup", function(event) {
    delete keys_pressed[event.key];

    if (event.code == 'Enter') {
        event.preventDefault();
    }
});

load_pyodide();
autosize(document.getElementById("console-command-input"));

$('body').delegate('#editorInput', 'keyup change', function(){
    var viewer = document.getElementById('viewer');
    viewer.innerHTML = marked(this.value);
 });

 $.get( "content.md", function( data ) {
    $("#editorInput").val(data);
    $("#viewer").html(marked(data));
},'text');