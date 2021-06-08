import autosize from "./autosize.js"

let num_lines = 0;
let keys_pressed = {};

let excluded_types = ["module", "DataFrame"];
let selected_vars_names = ["cb7e52b21171fb9a53b498202607f0bd", "MTISGR"]

async function load_pyodide() {
    document.getElementsByClassName("console-command-line")[0].style.visibility = "hidden";
    await loadPyodide({ 'indexURL' : "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/" }).then(() => {
        pyodide.runPythonAsync(`
                import micropip
                await micropip.install('https://files.pythonhosted.org/packages/68/ad/6c2406ae175f59ec616714e408979b674fe27b9587f79d59a528ddfbcd5b/seaborn-0.11.1-py3-none-any.whl')
            `).then(() => {
                pyodide.loadPackage(["numpy", "matplotlib", "pandas", "scipy"]).then(() => {
                    document.getElementsByClassName("console-command-line")[0].style.visibility = "visible";
                    document.getElementById("loading-inform").remove();

                    $(document).ready(function() {
                        $.ajax({
                            type: "GET",
                            url: "https://raw.githubusercontent.com/DiegoSaragozaSilva/TecWeb-P3/main/assets/data/churn-bigml-20.csv",
                            dataType: "text",
                            success: function(data) {processData(data);}
                         });
                    });
                    
                    function processData(allText) {
                        pyodide.globals.set('churnStr',allText);
                        pyodide.runPython(`
                        import io, base64
                        import sys
                        import numpy as np
                        import matplotlib.pyplot as plt
                        import pandas as pd
                        import seaborn as sns
                        sns.set()

                        churn = pd.read_csv(io.StringIO(churnStr))`
                        );
                    }
                });
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

function construct_dataframe_div(name, data) {
    var features = Array.from(data);
    var variables = [];
    
    var df_div = document.createElement("div");
    var df_table = document.createElement("table");

    df_table.className = "dataframe-container variable-description table";
    df_div.className = "variable-container w-90";

    var v_name = document.createElement("p");

    v_name.innerHTML = name + ' =';
    v_name.className = "variable-name m-2";

    df_div.appendChild(v_name);
    df_div.appendChild(df_table);

    var df_thead = document.createElement("thead");
    var df_tr_head = document.createElement("tr");
    var df_thshead = []
    var df_tbody = document.createElement("tbody");

    df_thshead.push(document.createElement("th"));
    df_thead.className = "thead-dark";
    df_thshead[0].scope = "col";
    df_thshead[0].innerHTML = "#";
    df_tr_head.appendChild(df_thshead[0]);

    df_table.appendChild(df_thead);
    df_thead.appendChild(df_tr_head);

    for(var i = 0; i < features.length; i++) {
        variables.push(Array.from(data[features[i]]));

        df_thshead.push(document.createElement("th"));
        df_thshead[i + 1].scope = "col";
        df_thshead[i + 1].innerHTML = features[i];
        df_tr_head.appendChild(df_thshead[i + 1]);
    }


    for(var i = 0; i < variables[0].length; i++) {
        var tr = document.createElement("tr");
        var th = document.createElement("th");

        th.scope = "row"
        th.innerHTML = i;
        tr.appendChild(th);

        for(var j = 0; j < features.length; j++) {
            var td = document.createElement("td");
            td.innerHTML = variables[j][i].toString();

            tr.appendChild(td);
        }

        df_tbody.appendChild(tr);
    }

    df_table.appendChild(df_tbody);

    document.getElementById("output-container-id").appendChild(df_div);
}

function get_variables() {
    var globals = Array.from(pyodide.globals);
    var globals_user = globals.slice(154, globals.length);

    for(let i = 0; i < globals_user.length; i++){
        if(!excluded_types.includes(pyodide.globals.get(globals_user[i]).type)){
            construct_variable_div(globals_user[i], pyodide.globals.get(globals_user[i]));
        }
        else if(pyodide.globals.get(globals_user[i]).type == "DataFrame") {
            construct_dataframe_div(globals_user[i], pyodide.globals.get(globals_user[i]));
        }
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