//add item
let btn = document.getElementById("btn");
let items = document.getElementById("items");
btn.addEventListener('click',function(){
    let inputVal = document.getElementById("input").value ;
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(inputVal));
    li.className = 'list-group-item';
    items.appendChild(li);
    document.getElementById("input").value = '';
});

//double click to remove item
items.addEventListener("dblclick",function(e){
    items.removeChild(e.target);
});