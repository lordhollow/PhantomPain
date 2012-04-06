onmessage = function(event)
{
	var dt = event.data;
	//var document = dt.document;
	
	for (var i=dt.begins; i<dt.begins+100000 ; i++)
	{
		factorization(i);
	}
	var node = 4;
	//var node = document.createElement("SPAN");
	//node.innerHTML = "FINISHED.";
	
	postMessage({code: -1, begins: dt.begins, node: node});
}

function factorization(number){  
    var n = 2;  
    var answer = new Array();  
  
    while (number > 1) {  
        if (number % n == 0) {  
            answer.push(n);  
            number /= n;  
        }  
        else  
            n++;  
    }  
    return answer;  
}
