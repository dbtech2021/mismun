
var lat = 0,lng = 0
var line = L.polyline([[lat,lng],[lat,lng]]).addTo(map)
var marker_mouse = L.circleMarker([lat,lng]).addTo(map).bindTooltip('<b>ระยะทางรวม '+Math.floor(0).toString().substring(0,2)+'.'+Math.floor(0).toString().substring(2,4)+' กม.</b>').openTooltip()

map.addEventListener('mousemove',event=>{
	lat = Object.values(event)[3]['lat']
	lng = Object.values(event)[3]['lng']
	document.getElementById('latlng').innerHTML = lat.toFixed(2)+" , "+lng.toFixed(2)
	if(start_distance && history_distance.length > 0){
		map.removeLayer(line)
		line = L.polyline([history_distance[history_distance.length-1],[lat,lng]],
		{
				weight:5,
				dashArray:'8,10',
				lineCap: 'square',
				color: '#FF7F3F'
			}).addTo(map)
		map.removeLayer(marker_mouse)
		let tmp = 0
		let i =0
		while(i < history_distance.length-1){
			tmp = getDistance(history_distance[i], history_distance[i+1])
			i++
		}
		tmpAns = getDistance(history_distance[history_distance.length-1], [lat,lng])
		marker_mouse = L.circleMarker([lat,lng]).bindTooltip('<b>ระยะทางรวม '+Math.floor(tmp+tmpAns).toString().substring(0,2)+'.'+Math.floor(tmp+tmpAns).toString().substring(2,4)+' กม.</b>').openTooltip().addTo(map)
		marker_mouse.setStyle({
			color:'#FF7F3F'
		})
	}else if(history_distance.length == 0){

	}
})

var distance_layer = L.layerGroup().addTo(map)
var history_distance = []
var set_distance = []
var start_distance = false

function startAdd(){
	start_distance = !start_distance
	if(start_distance){
		document.getElementById('map').style.cursor = 'crosshair'
		for(let i=0;i<document.getElementsByClassName('distance-ui').length;i++){
			document.getElementsByClassName('distance-ui')[i].style.display = 'block'
		}
	}else{

		document.getElementById('map').style.cursor = 'grab'
		for(let i=0;i<document.getElementsByClassName('distance-ui').length;i++){
			document.getElementsByClassName('distance-ui')[i].style.display = 'none'
		}
	}


}

map.addEventListener('click',event=>{
	console.log(checkHistory(lat,lng),[lat,lng],history_distance)
	if(start_distance){
		if(checkHistory(lat,lng) == 1){
			saveLine()
		}else if(checkHistory(lat,lng) == 2){
			console.log('))))))))))))))))))))))')
			console.log([history_distance[history_distance.length-1],history_distance[0]])
			history_distance.splice(0,0,history_distance[history_distance.length-1])
			set_distance.push(history_distance)
			map.removeLayer(marker_mouse)
			map.removeLayer(line)
			history_distance = []
			map.removeLayer(distance_layer)
			distance_layer = L.layerGroup().addTo(map)
			console.log(set_distance)
			console.log('---------><----------')
			drawSetDistance()
			console.log('step 2')
		}else{
			history_distance.push([lat,lng])
			map.removeLayer(distance_layer)
			distance_layer = L.layerGroup().addTo(map)
			history_distance.forEach(item=>{
				let marker = L.circleMarker(item)
				marker.setStyle({
					color:'#FF7F3F'
				})
				distance_layer.addLayer(marker)
			})
			drawSetDistance()
			drawLineHistory()
			console.log('step 3')
		}
		calcul_History()

	}
	console.log(history_distance)
})

function saveLine(){
	//history_distance.splice(0,0,history_distance[history_distance.length-1])
	//history_distance.pop()
	console.log(history_distance)
	set_distance.push(history_distance)
	history_distance = []
	map.removeLayer(distance_layer)
	distance_layer = L.layerGroup().addTo(map)
	map.removeLayer(marker_mouse)
	map.removeLayer(line)
	drawSetDistance()
}
var sum_distance = 0
function drawSetDistance(){
	sum_distance = 0
	set_distance.forEach(item=>{
		let i = 0
		console.log(item)
		sum_distance = 0
		while( i < item.length-1){
			let line = L.polyline([item[i],item[i+1]])
			console.log(getDistance(item[i], item[i+1]),item[i], item[i+1])
			sum_distance += getDistance(item[i], item[i+1])
			line.setStyle({
				color:'#FF5959'
			})
			distance_layer.addLayer(line)
			i++
			console.log(i)
		}
		console.log(item)
		console.log('---------------')
		if(item[item.length-1][0] == item[0][0] && item[item.length-1][1] == item[0][1] ){
			console.log('วาดเส้นเพิ่ม')
			//sum_distance += getDistance(item[item.length-1], item[0])
			let line_end = L.polyline([item[item.length-1],item[0]])
			line_end.setStyle({
				color:'#1A374D'
			})
			distance_layer.addLayer(line_end)
		}
		if(( Math.abs(item[item.length-1][0] - item[0][0])  < 0.008 && Math.abs(item[item.length-1][1] - item[0][1]) < 0.008)){
			console.log('วาดเส้นเพิ่ม')
			//sum_distance += getDistance(item[item.length-1], item[0])
			let line_end = L.polyline([item[item.length-1],item[0]])
			line_end.setStyle({
				color:'#1A374D'
			})
			distance_layer.addLayer(line_end)
		}

		let layout = L.circleMarker(item[item.length-1],{radius:0}).bindTooltip('<b>ระยะทาง '+Math.floor(sum_distance).toString().substring(0,2)+'.'+Math.floor(sum_distance).toString().substring(2,4)+' กม.</b>').addTo(map).openTooltip()
		distance_layer.addLayer(layout)

	})
}
function clearDistance(){
	map.removeLayer(distance_layer)
	start_distance = false
	distance_layer = L.layerGroup().addTo(map)
	document.getElementById('map').style.cursor = 'grab'
	map.removeLayer(marker_mouse)
	map.removeLayer(line)
	history_distance = []
	set_distance = []
}

function drawLineHistory(){
	let i = 0
	let line = L.polyline(history_distance,{
		weight: 5,
		dashArray: '8, 10',
		lineCap: 'square',
		color: '#EA5C2B'
	})
	distance_layer.addLayer(line)

}

function calcul_History(){
	let i = 0
	console.log(history_distance.length)
	let sum_distance = 0
	while(i < history_distance.length-1){
		sum_distance = getDistance(history_distance[i], history_distance[i+1])
		i++
	}
	console.log(sum_distance)
}

function checkHistory(lat_l,lng_l){
	let check = 0
	let i = 0
	console.log(history_distance.length)
	while(i < history_distance.length){
		if(( history_distance[0][0] == lat_l && history_distance[0][1]== lng_l && history_distance.length > 1)){
			check = 2
			console.log('case 1')
			break
		}else if(history_distance[i][0] == lat_l && history_distance[i][1] == lng_l){
			check = 1
			console.log('case 2')
			break
		}
		console.log(Math.abs(history_distance[i][0] - lat_l),Math.abs(history_distance[i][1] - lng_l))
		if(( Math.abs(history_distance[0][0] - lat_l)  < 0.008 && Math.abs(history_distance[0][1] - lng_l) < 0.008 && history_distance.length > 1)){
			check = 2
			console.log('case 3')
			break
		}else if(Math.abs(history_distance[i][0] - lat_l)  < 0.008 && Math.abs(history_distance[i][1] - lng_l) < 0.008){
			check = 1
			console.log('case 4')
			break
		}
		i++
	}
	return check
}
/*=========================================================================*/
//วัด
function getDistance(origin, destination) {
		var lon1 = toRadian(origin[1]),
				lat1 = toRadian(origin[0]),
				lon2 = toRadian(destination[1]),
				lat2 = toRadian(destination[0]);

		var deltaLat = lat2 - lat1;
		var deltaLon = lon2 - lon1;

		var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
		var c = 2 * Math.asin(Math.sqrt(a));
		var EARTH_RADIUS = 6371;
		return c * EARTH_RADIUS * 1000;
}
function toRadian(degree) {
		return degree*Math.PI/180;
}
