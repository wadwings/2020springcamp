img = document.getElementsByTagName('img');

window.onload = function(){
    init();
}

function init() {
    for (var i = 0; i < img.length; i += 2) {
        img[i].onclick = function () {
            if (this.style.transform == "scale(2, 2) translate(30%, 30%)")
                this.setAttribute('style', 'transform: none; transition: 0.5s');
            else
                this.setAttribute('style', 'transform:scale(2,2) translate(30%,30%); transition: 0.5s')
        }
    }
    for (var i = 1; i < img.length; i += 2) {
        img[i].onclick = function () {
            if (this.style.transform == "scale(2, 2) translate(-30%, 30%)")
                this.setAttribute('style', 'transform: none; transition: 0.5s');
            else
                this.setAttribute('style', 'transform:scale(2,2) translate(-30%,30%); transition: 0.5s')
        }
    }
}