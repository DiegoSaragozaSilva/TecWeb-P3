let num_lines = 0;
let partial_code = "";
let is_typing_code = false;
let first_line = true;
let ident_num = 0;

let key_words = ["for", "while", "else", "elif", "if"];

async function load_pyodide() {
    await loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/" }).then(() => {
    });
}

function construct_variable_div(name, value) {
    if (value.length >= 50) {
        value_trim = String(value).substring(0, 50);
        value_trim += "...";
        value = value_trim;
    }

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

function get_variables() {
    var globals = Array.from(pyodide.globals.toJs());
    var globals_user = globals.slice(154, globals.length);

    for(let i = 0; i < globals_user.length; i++){
        construct_variable_div(globals_user[i][0], globals_user[i][1]);
    }
}

function send_python_code(code) {

    // Checando sintaxe de for, if, else, elif e while
    for(let i = 0; i < key_words.length; i++) {
        if(code.includes(key_words[i]) && !is_typing_code) {
            partial_code += code;
            is_typing_code = true;
            ident_num++;
            return;
        }
    }

    if(!is_typing_code && partial_code === "") {
        pyodide.runPython(code);
    }
    else if(!is_typing_code && partial_code !== "") {
        try {
            pyodide.runPython(partial_code);
            console.log(partial_code);
            partial_code = "";
            first_line = true;
            ident_num = 0;
        }
        catch (e) {
            console.log("ERROR:\n" + partial_code);
            partial_code = "";
            ident_num = 0;
        }
    }
    else {
        for(let i = 0; i < key_words.length; i++) {
            if(code.includes(key_words[i]) && key_words[i] !== "else" && key_words[i] !== "elif") {
                partial_code += "\n" + "\t".repeat(ident_num) + code;
                first_line = false;
                ident_num++;
                return;
            }
            else if (code.includes(key_words[i]) && (key_words[i] === "else" || key_words[i] === "elif")) {
                partial_code += "\n" + "\t".repeat(ident_num - 1) + code;
                first_line = false;
                return;
            }
        }
        partial_code += "\n" + "\t".repeat(ident_num) + code;
        first_line = false;
    }
}

function add_line_to_console(code) {
    if(!is_typing_code || first_line){
        var line = document.createElement("p");
        line.className = "text-white pl-1";
        line.innerHTML = "[" + num_lines + "]" + "\t" + code;

        document.getElementById("console-prompt").appendChild(line);
        
        num_lines++;
    }
    else {
        var line = document.createElement("p");
        line.className = "text-white pl-1";
        line.innerHTML = "....".repeat(ident_num) + "\t" + code;

        document.getElementById("console-prompt").appendChild(line);
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

// Events
document.getElementById("console-command-input").addEventListener("keyup", function(event) {
    if (event.code == 'Enter') {
        event.preventDefault()

        let code = document.getElementById("console-command-input").value;
        if(code === "") {
            is_typing_code = false;
        }

        send_python_code(code);

        add_line_to_console(code);

        clear_input();

        clear_workspace();

        get_variables();
    }
});

load_pyodide();


$('body').delegate('#editorInput', 'keyup change', function(){
    var viewer = document.getElementById('viewer');
    viewer.innerHTML = marked(this.value);
 });

 $.get( "content.md", function( data ) {
    $("#editorInput").val(data);
    $("#viewer").html(marked(data));
},'text');
