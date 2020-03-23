document
   .querySelector("button.fat")
   .addEventListener("click", toggleFooter)
; 

function toggleFooter(){
   document
      .querySelector("#footer")
      .classList
      .toggle("hide")
   ;   
}