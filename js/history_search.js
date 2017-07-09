$(document).ready(function() {
    var radios = document.getElementsByClassName('radio');
    var infoContainer = document.getElementById('infoContainer');
    var searchButton = document.getElementById('searchButton');

    searchButton.onclick = function() {
        var i;
        for (i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                updateHTML(i, infoContainer);
                break;
            }
        }
    };
});

function updateHTML(no, infoContainer) {
    var str, html = '', i;
    if (no === 0) {
        str = '粤A-00000 奇瑞QQ';
    } else if (no === 1) {
        str = '张三 男 15620000000';
    } else {
        str = '2017/6/26 起始点：中山大学东校区 终点：中山大学南校区';
    }

    for (i = 0; i < 3; i++) {
        html += '<li>';
        html += i + 1 + '. ';
        html += str;
        html += '</li>';
    }

    infoContainer.innerHTML = html;
}