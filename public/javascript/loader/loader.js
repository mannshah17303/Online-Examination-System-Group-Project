function preventDefaultFunc(e){
    e.preventDefault();
}

function disabledEvent(e) {
   if (e.stopPropagation) {
       e.stopPropagation();
   } else if (window.e) {
       window.e.cancelBubble = true;
   }
   e.preventDefault();
   return false;
}

function onkeydownFunc(e){
    if(e.keyCode == 123) { 
        disabledEvent(e);
    }

    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)){ 
        disabledEvent(e); 
    }
    
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)){ 
        disabledEvent(e);
    }

    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)){ 
        disabledEvent(e);
    }
}

function addLoader(){
    document.addEventListener('contextmenu', preventDefaultFunc);
    document.addEventListener("keydown", onkeydownFunc);
    document.getElementById('disableWholeScreen').classList.add("stopUserMovements");
    document.getElementById('loaderDialog').style.display = 'flex';
}

function removeLoader(){
    document.removeEventListener('contextmenu', preventDefaultFunc);
    document.removeEventListener("keydown", onkeydownFunc);
    document.getElementById('disableWholeScreen').classList.remove("stopUserMovements");
    document.getElementById('loaderDialog').style.display = 'none';
}