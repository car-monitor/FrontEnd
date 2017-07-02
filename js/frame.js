// 此文件仅为示例代码，仅供参考，实际开发时候请自行决定

function createMap() {
    var mapElement = document.getElementById('map'),
        map,
        drivingService,
        lastLat,
        lastLng;

    // 创建地图
    map = new qq.maps.Map(mapElement, {
        center: new qq.maps.LatLng(23.06409661136831, 113.38997840881348),
        zoom: 14
    });

    drivingService = new qq.maps.DrivingService({
        map: map
    });

    // 绑定点击事件，获取位置信息
    qq.maps.event.addListener(map, 'click', function(event) {
        // alert('您的点击位置为：[' + event.latLng.getLat() + ', ' + event.latLng.getLng() + ']');

        if (lastLat && lastLat != event.latLng.getLat()) {
            search(drivingService, new qq.maps.LatLng(lastLat, lastLng), event.latLng);
        }

        lastLat = event.latLng.getLat();
        lastLng = event.latLng.getLng();

        var marker = new qq.maps.Marker({
            position: event.latLng,
            map: map
        });

        var label = new qq.maps.Label({
            position: event.latLng,
            map: map,
            content: '纬度：' + lastLat + ', 经度：' + lastLng
        });
    });
}

function search(drivingService, start, end) {
    drivingService.setLocation('广州');
    drivingService.setComplete(function(result) {
        if (result.type == qq.maps.ServiceResultType.MULTI_DESTINATION) {
            var d = result.detail;
            drivingService.search(d.start[0], d.end[0]);
        }
    });

    drivingService.setError(function(data) {
        alert(data);
    });

    drivingService.search(start, end);
}

// $(document).ready(function() {
//     $('#mask').toggle();
//     $('#popUps').toggle();

//     $('body').click(function(event) {
//         // 不让body滚动破坏
//         // if ($('#mask').css('display') === 'block') {
//         //     $(this).css({
//         //         'overflow-x': 'auto',
//         //         'overflow-y': 'auto'
//         //     });
//         // } else {
//         //     $(this).css({
//         //         'overflow-x': 'hidden',
//         //         'overflow-y': 'hidden'
//         //     });
//         // }
//         // 设置蒙层和弹窗的位置和隐藏属性
//         // You can't use 'macro parameter character #' in math mode(document).scrollTop()).toggle();
//         // You can't use 'macro parameter character #' in math mode('body').height() + $(document).scrollTop()).toggle();
//         $('#mask').toggle();
//         $('#popUps').toggle();
//     });
// });