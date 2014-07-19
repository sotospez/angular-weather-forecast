/**
 * Created by sotiris on 19/7/2014.
 * angular directive for weather
 * with Skycons and forecast.io
 *
 * pezouvanis sotiris - sotos.gr
 * info@sotos.gr
 *
 */

app.directive('weather',[ '$timeout','$http',function ($timeout ,$http) {

    return {
        restrict: 'E,C',
        transclude:false,
        scope:{},
        template: '<div class="today">'+
            '<span class="title">TODAY  {{ timeDate }} - {{ timeNow }}</span><br/>'+
            '<canvas id="{{ iconid }}" class="icon" width="128" height="128"></canvas>'+
            '<br/>'+
            '<span class="summary"> {{ summary }} </span>'+
            '<br/>'+
            '<span class="temp"> {{ C0 }} °C </span>'+
            '<span> / </span>'+
            '<span class="temp"> {{F0}} °F </span>'+
            '<br/>'+
            '<span class="wind1">Wind : </span>'+
            '<span class="wind1speed">{{  windSpeed0  }} mph | {{  windBearing0  }}</span>'+
            '<br/>'+
            '<span class="sunset">Sunset :</span>'+
            '<span class="sunsettext"> {{sunsetTime }}</span>'+
            '<br/>'+
            '<span class="sunrise">Sunrise :</span>'+
            '<span class="sunrisetext"> {{sunriseTime }}</span>'+
            '</div>',

        link: function(scope, element, attrs) {

            //set wind directions
            var _directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
            //get wind directions base on angle
            var getDirection =  function  (hea) {
                return _directions[Math.floor((hea % 360) / 45)];
            };
            var icons = new Skycons({color:attrs.color});
            var list_icos = ["clear-day", "clear-night", "partly-cloudy-day","partly-cloudy-night", "cloudy", "rain", "sleet", "snow", "wind","fog"];



            //create id for the icon
           scope.iconid= 'icon'+Math.floor((Math.random() * 1000) + 1);

            //format time
            var timeToHM =  function (date) {
                var h = date.getHours();
                var m = date.getMinutes();
                //var s = date.getSeconds();
                return '' + (h<=9 ? '0' + h : h) + ':' + (m<=9 ? '0' + m : m) ;
            };
            //format date
            var dateToDMY =  function (date) {
                var d = date.getDate();
                var m = date.getMonth()+1;
                var y = date.getFullYear();
                return '' + (d<=9 ? '0' + d : d) + '-' + (m<=9 ? '0' + m : m)+ '-' + (y<=9 ? '0' + y : y) ;
            };



            var setdata =function(data){

             //   console.log(data);
                //set data to scope
                scope.icon =data.currently.icon;
                scope.summary =data.currently.summary;
             // scope.mdata0=data.daily.data[0];
                scope.mdata1=data.daily.data[1];
                scope.windSpeed0 = data.currently.windSpeed;
                scope.windBearing0 = getDirection(data.currently.windBearing);
                scope.F0 = Math.round(data.currently.temperature);
                scope.C0=  Math.round( (scope.F0-32) * 5 / 9);

                var sunriseTime = new Date( scope.mdata1.sunriseTime*1000);
                var sunsetTime = new Date( scope.mdata1.sunsetTime*1000);
                var timeNow = new Date( data.currently.time*1000);
                var timeDate = new Date( data.currently.time*1000);

                scope.sunriseTime =timeToHM(sunriseTime);
                scope.sunsetTime = timeToHM(sunsetTime);
                scope.timeNow = timeToHM(timeNow);
                scope.timeDate = dateToDMY(timeDate);


                //run icons
                $timeout(function(){
                   // var i;
                   // for(i = list_icos.length; i--; ){
                   //   icons.set(list_icos[i]+scope.iconid, list_icos[i]);
                   // }
                    icons.set(scope.iconid, scope.icon);
                    icons.play();
                },2000);


            };


            $http.jsonp('https://api.forecast.io/forecast/'+attrs.apikey+'/'+attrs.location+'?callback=JSON_CALLBACK').success(setdata);

        }
    };
}]);







