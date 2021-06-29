function logout() {
	sessionStorage.clear();
	window.location.replace("login.html");
}
			
$(document).ready(function(){
	var name = sessionStorage.getItem("name");
	$("#greeting").html("Hello, " + name);
	document.title += ": " + name;
});