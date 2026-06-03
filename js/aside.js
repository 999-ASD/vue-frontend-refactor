window.addEventListener('load',function() {	
	for(let i=1;i<4;i++){
		let aside_dt = document.getElementById("aside_dt_"+i);
		let aside_dd = document.getElementById("aside_dd_"+i);
		aside_dt.onclick = function(){
			if("block" == aside_dd.style.display){
				aside_dd.style.display = "none";
			}else{
				aside_dd.style.display = "block";
			}
		}
	}
})