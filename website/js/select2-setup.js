// This code is needed to initialize any select2 user interface items
// on the page.

$(document).ready(function(){
   $("select").select2({
      width: "off"
   });
   $('input[type=checkbox]').ezMark();
   $('input[type=radio]').ezMark();
});
