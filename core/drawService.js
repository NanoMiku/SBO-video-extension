var sboModule = sboModule || {};

var array_stuff = []; 

var button = document.createElement("Button");
button.innerHTML = "eat it all";
button.style = "top:0;right:0;position:absolute;z-index: 9999";
document.body.appendChild(button);

let array_handing = function(){
    console.log(array_stuff)
    for (var a = 0; a<10; a++){
        for (var i = 0; i<array_stuff.length; i++){
            //console.log(array_stuff[i][2], array_stuff[i][0].bitrate);
        //console.log);
        if (i == 0){ 
            continue;
        }
        else if(array_stuff[i][2] == array_stuff[i-1][2]) {
            array_stuff.splice(i-1, 1)
            //console.log("hello world");
        }
    }
      
    }
    console.log(array_stuff);
}

sboModule.drawService = (function () {

    let getTitle = function (flavor) {
        return (flavor.isAudio ? 'Audio file' : 'Video file') + ' with width: ' + flavor.width +
            ', and height: ' + flavor.height + ' and bitrate: ' + flavor.bitrate;
    };

    let downloadHandler = function (flavor, videoUrl, index, title) {
        let http = new XMLHttpRequest();
        http.open('HEAD', videoUrl.replace(/^(.*)\/.*$/, '$1/' + flavor.id));
        http.onreadystatechange = function () {
            if (this.readyState === this.DONE) {
                let finalUrl = this.responseURL.split('/clipTo/60000/name/a.mp4').join('');
                chrome.runtime.sendMessage({
                    videoUrl: finalUrl,
                    index: index,
                    title: title
                }, function (response) {
                });
            }
        };
        http.send();
    };

    button.onclick = function() {
        console.log("hello world");
        //console.log(array_stuff)
        array_handing();
        
        //downloadHandler(array_stuff[4][0], array_stuff[4][1], array_stuff[4][2], array_stuff[4][3]);
        
        var i = 0;

        var intervalId = setInterval(function(){
            if(i == array_stuff.length){
               clearInterval(intervalId);
                           }
            downloadHandler(array_stuff[i][0], array_stuff[i][1], array_stuff[i][2], array_stuff[i][3]);         
            i++;
         }, 40000);
    }
    
    return {
        draw: function (domList, videoUrl, index, flavors) {

            let element = domList.get(index);

            let dldBtnIcon = $('<i>').attr('class', 'fa fa-download');
            let dldBtn = $('<a>').attr('title', '').attr('style', 'cursor: pointer; margin-left: 7px;').append(dldBtnIcon);
            let title = $(element).attr('title') || $(element).text();
            dldBtn.insertAfter($('.orm-PlaylistsDropdown-playlistsDropdown', $(element)));

            var dialogStyle = 'padding: 6px 14px 5px 12px;' +
                'margin-left: -240px;' +
                'box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 2px 2px;' +
                'background-color: rgb(255, 255, 255);' +
                'z-index: 99;' +
                'top: 0px;' +
                'left: 0px;' +
                'display: none;';

            let dialog = $('<div>').attr('style', dialogStyle + ';display: inline;');

            dialog.insertAfter($(dldBtn));

            let size = 12;
            flavors.forEach(f => {
                let dldBtnIcon = $('<i>').attr('class', f.isAudio ? 'fa fa-headphones' : 'fa fa-video-camera').attr('style', 'font-size: ' + size + 'px;');
                let dldBtn = $('<a>').attr('title', getTitle(f)).attr('style', 'cursor: pointer; margin: 2px 12px 12px 2px;').append(dldBtnIcon);
                dialog.append(dldBtn);
                size += 1;               
                if (f.width != 0) {
                    
                    array_stuff.push([ f, videoUrl,index, title]);
                }
                              
                dldBtn.click(function () {
                    downloadHandler(f, videoUrl, index, title);                
                });
            });
        }  
    }    
}());
