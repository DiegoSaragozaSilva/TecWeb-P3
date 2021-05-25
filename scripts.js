$('body').delegate('#editorInput', 'keyup change', function(){
    var viewer = document.getElementById('viewer');
    viewer.innerHTML = marked(this.value);
 });