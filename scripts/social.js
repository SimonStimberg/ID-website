// used to trick bots from harvesting
function parseMl() {
    var part1 = "post";
    var part2 = Math.pow(2,6);
    var part3 = "simonstimberg.de"
    var part4 = part1 + String.fromCharCode(part2) + part3;
    document.write("<a href=" + "mai" + "lto" + ":" + part4 + "><img src=\"assets/img/post.svg\" alt=\"mai" + "l me\"/></a>");
}