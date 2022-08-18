window.getAge = birthDate => Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e+10);

var pressedKeys = {};
window.onkeyup = function(e) {
    pressedKeys[e.keyCode] = false;
}
window.onkeydown = function(e) {
    pressedKeys[e.keyCode] = true;
}