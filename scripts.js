$('body').delegate('#editorInput', 'keyup change', function(){
    var viewer = document.getElementById('viewer');
    viewer.innerHTML = marked(this.value);
 });

 $.get( "content.md", function( data ) {
    $("#editorInput").val(data);
    $("#viewer").html(marked(data));
},'text');