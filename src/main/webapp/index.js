$(function(){
    updateSavedGuest();
    updateVisitingInformation();
});


function uploadFile(obj) {
    var html = '';
    if(obj.files[0] != undefined){
        var filename = obj.files[0].name;
        html = '<p id="selectedFile">Selected file:<br/>' + filename + '</p>';

        // alert("Selected file: " + filename);
    } else {
        // alert("no file");
        html = '<img id="adder" src="add.png">';
    }
    $("#fileLable").html(html);
};

function submitFile() {
	var file = document.getElementById('file').files[0];
	var guestName = $("#name").val();
	if(file == undefined){
		alert("Please select a picture.");
	} else if(guestName === ""){
		alert("Please enter the guest name.");
	}else {
		var filename = file.name;
		var formData = new FormData();
		formData.append('img', file);
		formData.append('name', guestName);
		$.ajax({
            url: './AddNewGuest',
            type: 'POST',
            data: formData,
            // async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function(res) {
                alert(res);
				window.location.reload();
            }
        });
	}
}

function updateSavedGuest() {
    $.get("./ReadSavedGuest", function(data){
        var dataList = data.split("\n");
        dataList.sort();
        for(var i=0; i<dataList.length; i++){
            var html = '<tr>' +
                            '<td class="name">' + dataList[i] + '</td>' + 
                            '<td class="deleteGuest" onclick="deleteGuest(this)">DELETE</td>' + 
                        '</tr>';
            $("#savedGuest").append(html);
        }
    });
}

function updateVisitingInformation() {
    $.get("./ReadVisitingInformation", function(data){
        // alert("data:" + JSON.parse(data));

        var dataList = new Array();
        var n = 0;
        for(var key in JSON.parse(data)){
            var time = JSON.parse(data)[key].split("\n")[0];
            var name = JSON.parse(data)[key].split("\n")[1];
            var itemList = new Array(key, time, name);
            dataList[n] = itemList;
            n++;
        }   
        dataList.sort();

        for(var i=0; i<n; i++){
            var html =  '<tr class="item">' + 
                            '<td class="infoName">' + dataList[i][2] + '</td>' +
                            '<td class="infoTime">' + dataList[i][1] + '</td>' +
                            '<td class="infoDel" onclick="deleteInfo(this)">DELETE</td>' + 
                        '</tr>';
            $("#info").append(html);
        }
    });
}


function deleteGuest(obj) {
    var r = confirm("Delete this guest?");
    if (r == true) {
        $.post("./DeleteGuest", function(data){
            if(data == 1){
                updateVisitingInformation();
                alert("deleteGuest");
            }else{
                alert("error");
            }
        });
    }
}

function deleteInfo(obj) {
    var r = confirm("Delete this visiting information?");
    if (r == true) {
        $.post("./DeleteInfo", function(data){
            if(data == 1){
                updateVisitingInformation();
                alert("deleteInfo");
            }else{
                alert("error");
            }
        });
    }
}

function clearInfo() {
    var r = confirm("Delete all visiting information?");
    if (r == true) {
        $.post("./ClearInfo", function(data){
            if(data == 1){
                updateVisitingInformation();
                alert("clearInfo");
            }else{
                alert("error");
            }
        });
    }
}