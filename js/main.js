L.TopoJSON = L.GeoJSON.extend({
	addData: function(jsonData) {
		if (jsonData.type === "Topology") {
			for (key in jsonData.objects) {
				geojson = topojson.feature(jsonData, jsonData.objects[key]);
				L.GeoJSON.prototype.addData.call(this, geojson);
			}
		}
		else {
			L.GeoJSON.prototype.addData.call(this, jsonData);
		}
	}
})

class DBTechMap{
	constructor(lat, lng, text, zoom){
		this.zoom = zoom
		this.img_map = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
		this.map = L.map('map',{zoomControl:false,pmIgnore: false}).setView([lat,lng],this.zoom)
		this.layer = L.tileLayer(this.img_map+'?key=atdoiSMFutOTW2mSNsCa',{attribution : text,})
		this.layer.addTo(this.map)
	}

	getMap(){
		return this.map
	}

	getLayer(){
		return this.layer
	}
}


var zoom = 8.5
var obj = new DBTechMap(15.42622873298402, 103.20372799918925, '&copy; DBTech',zoom)
var map = obj.getMap()
var layer_map = obj.getLayer()

function zoom_control(parameter){
	zoom += parameter
	map.setView([15.42622873298402, 103.20372799918925],zoom)
}


document.getElementById('slcTop').addEventListener('mouseover',function(){
	document.getElementsByClassName('slc-map')[0].style.display = 'block'
})

document.getElementById('map').addEventListener('mouseover',function(){
	document.getElementsByClassName('slc-map')[0].style.display = 'none'
})


function change_mapBg(){
	let url = document.getElementById('selectImg').value
	if(layer_map!= null){
		map.removeLayer(layer_map)
	}
	layer_map = L.tileLayer(url,{
		attribution : '&copy; DBTech',
	}).addTo(map)
}

function slcMap(element,url){
	resetImg()
	if(layer_map!= null){
		map.removeLayer(layer_map)
	}
	layer_map = L.tileLayer(url,{
		attribution : '&copy; DBTech',
	}).addTo(map)
	element.style.border = "2px solid #5e81ad"
}

function resetImg(){
	let len = document.getElementsByClassName('imgSlc').length
	for(let i=0;i<len;i++){
		document.getElementsByClassName('imgSlc')[i].style.border = "0px solid transparent"
	}

}

function displayOnMap(id, url, index, color='#008000', more = ''){
	if(document.getElementById(id).checked){
		val[id] = new L.TopoJSON(null, {
			style: {
				fillColor : '#99ffcc',
				fillOpacity: 0,
		 		color:color,
		 		weight:2,
		 		opacity:1
		 	}, onEachFeature: function(feature, layer) {
		      var popupContent = feature;
					let tmp = popupContent
					let txt_tmp = ''
					if(index[0] != 'none'){
						index.forEach(item => {
							let tmp = popupContent
							item.forEach(it => {
								tmp = tmp[it]
							})
							console.log(tmp)
							txt_tmp += ' '+tmp
						})
						console.log(txt_tmp)
						if(more!=''){
							txt_tmp =more+' '+txt_tmp
						}
						layer.bindPopup(txt_tmp);
					}

		  }
		})

		$.getJSON(url).done(function(topoData){
			val[id].addData(topoData);
			val[id].addTo(map);
		})
	}else{
		console.log(val[id])
		map.removeLayer(val[id])
	}
}

function displayOnMapChange(element,key,id){
	try{
		console.log(val[id])
		map.removeLayer(val[id])
		for(x=0;x<condition.length;x++){
			map.removeLayer(val[id+'_temp'])
		}
	}catch(err){

	}
	let url = ""
	if(element.value == "เลือกจังหวัด"){
		url = "none"
	}else if(element.value == "นครราชสีมา"){
		url = "http://localhost/mismun/json/Landuse/LU_NMA_2562.json"
	}else if(element.value == "บุรีรัมย์"){
		url = "http://localhost/mismun/json/Landuse/LU_BRM_2562.json"
	}else if(element.value == "สุรินทร์"){
		url = "http://localhost/mismun/json/Landuse/LU_SRN_2562.json"
	}else if(element.value == "ศรีสะเกษ"){
		url = "http://localhost/mismun/json/Landuse/LU_SSK_2562.json"
	}else if(element.value == "อุบลราชธานี"){
		url = "http://localhost/mismun/json/Landuse/LU_UBN_2562.json"
	}else if(element.value == "ลุ่มน้ำมูล"){
		url = "http://localhost/mismun/json/Landuse/LU_62.json"
	}
	MapColor(id,url,[['properties','LUL1_CODE']],['#f20000','#c5a58e','#017a00','#0000d6','#727272'],['U','A','F','W','M',],'LUL1_CODE','poly',0.9,'#000',1)
	
}

function MapColor(id, url, index, color=['#008000'],condition=[100],target,style_type = 'line',opacity = 1,stoke = 'none',size = 5, more = ''){
	let tmp_latlngs = []
	val[id] = new L.TopoJSON(null, {
			style: {
				fillColor : '#000000',
				fillOpacity: 0,
		 		color:color,
		 		weight:2,
		 		opacity:0
		 	}, onEachFeature: function(feature, layer) {
		 		
		      	var popupContent = feature;
				let tmp = popupContent
				let txt_tmp = ''
				let x = 0
				for(x=0;x<condition.length;x++){
					try{
						if(feature['properties'][target]<=condition[x]){
		  					tmp_latlngs.push([layer['_latlngs'],color[x],id+'_temp'+x])
		  				}
					}catch(err){
						if(feature['properties'][target]==condition[x]){
		  					tmp_latlngs.push([layer['_latlngs'],color[x],id+'_temp'+x])
		  				}
					}
		  			
		  		}
				if(index[0] != 'none'){
					index.forEach(item => {
							let tmp = popupContent
							item.forEach(it => {
								tmp = tmp[it]
							})
							txt_tmp += ' '+tmp
						})
						
						if(more!=''){
							txt_tmp =more+' '+txt_tmp
						}
						
						layer.bindPopup(txt_tmp);
					}
				}
		})

		$.getJSON(url).done(function(topoData){
			val[id].addData(topoData);
			val[id].addTo(map);
			val[id+'_temp'] = L.layerGroup().addTo(map)
			tmp_latlngs.reverse().forEach(it =>{
				let tmp_line = null
				let color_stoke = stoke
				if(stoke=='none'){
					color_stoke = it[1]
				}
				if(style_type == 'line'){
					tmp_line = L.polyline(it[0],{
						fillColor : it[1],
						fillOpacity: opacity,
						color:color_stoke,
						weight:size,
						opacity:opacity
					})
				}else{
					tmp_line = L.polygon(it[0],{
						fillColor : it[1],
						fillOpacity: opacity,
						color:color_stoke,
						weight:size,
						opacity:opacity
					})
				}
			  	
			  	val[id+'_temp'].addLayer(tmp_line)
			})
		})
}

function displayOnMapColor(id, url, index, color=['#008000'],condition=[100],target,style_type = 'line',opacity = 1,stoke = 'none',size = 5, more = ''){
	let tmp_latlngs = []
	if(document.getElementById(id).checked){
		val[id] = new L.TopoJSON(null, {
			style: {
				fillColor : '#000000',
				fillOpacity: 0,
		 		color:color,
		 		weight:2,
		 		opacity:0
		 	}, onEachFeature: function(feature, layer) {
		 		
		      	var popupContent = feature;
				let tmp = popupContent
				let txt_tmp = ''
				let x = 0
				for(x=0;x<condition.length;x++){
					try{
						if(feature['properties'][target]<=condition[x]){
		  					tmp_latlngs.push([layer['_latlngs'],color[x],id+'_temp'+x])
		  				}
					}catch(err){
						if(feature['properties'][target]==condition[x]){
		  					tmp_latlngs.push([layer['_latlngs'],color[x],id+'_temp'+x])
		  				}
					}
		  			
		  		}
				if(index[0] != 'none'){
					index.forEach(item => {
							let tmp = popupContent
							item.forEach(it => {
								tmp = tmp[it]
							})
							txt_tmp += ' '+tmp
						})
						
						if(more!=''){
							txt_tmp =more+' '+txt_tmp
						}
						
						layer.bindPopup(txt_tmp);
					}
				}
		})

		$.getJSON(url).done(function(topoData){
			val[id].addData(topoData);
			val[id].addTo(map);
			console.log(tmp_latlngs)
			val[id+'_temp'] = L.layerGroup().addTo(map)
			tmp_latlngs.reverse().forEach(it =>{
				let tmp_line = null
				console.log(it)
				let color_stoke = stoke
				if(stoke=='none'){
					color_stoke = it[1]
				}
				if(style_type == 'line'){
					tmp_line = L.polyline(it[0],{
						fillColor : it[1],
						fillOpacity: opacity,
						color:color_stoke,
						weight:size,
						opacity:opacity
					})
				}else{
					tmp_line = L.polygon(it[0],{
						fillColor : it[1],
						fillOpacity: opacity,
						color:color_stoke,
						weight:size,
						opacity:opacity
					})
				}
			  	
			  	val[id+'_temp'].addLayer(tmp_line)
			})
		})
	}else{
		console.log(val[id])
		map.removeLayer(val[id])
		for(x=0;x<condition.length;x++){
			map.removeLayer(val[id+'_temp'])
		}
	}
}

function displayOnMapBg(id, url, index, color='#008000',color_bg='#008000', more = ''){
	if(document.getElementById(id).checked){
		val[id] = new L.TopoJSON(null, {
			style: {
				fillColor : color_bg,
				fillOpacity: 0.5,
		 		color:color,
		 		weight:2,
		 		opacity:1
		 	}, onEachFeature: function(feature, layer) {
		 		console.log('----------------------------------------')
		 		console.log(layer)
		      var popupContent = feature;
					let tmp = popupContent
					let txt_tmp = ''
					if(index[0] != 'none'){
						index.forEach(item => {
							let tmp = popupContent
							item.forEach(it => {
								tmp = tmp[it]
							})
							console.log(tmp)
							txt_tmp += ' '+tmp
						})
						console.log(txt_tmp)
						if(more!=''){
							txt_tmp =more+' '+txt_tmp
						}
						layer.bindPopup(txt_tmp);
					}

		  }
		})

		$.getJSON(url).done(function(topoData){
			val[id].addData(topoData);
			val[id].addTo(map);
		})
	}else{
		console.log(val[id])
		map.removeLayer(val[id])
	}
}



function fetchData(key,url){
	fetch(url)
  .then(response => response.json())
  .then(data => {
		if(Object.keys(data)[6] == 'regions'){
			let region = ''
			data['regions'].forEach(item=>{
				region = item['region_name']
				item['dams'].forEach(data_fil=>{
					data_fetch[data_fil.DAM_ID] =  [data_fil.DMD_Inflow,region]
				})
			})
		}else if(Object.keys(data)[2] == 'region'){
			let region = ''
			data['region'].forEach(item=>{
				region = item['region_name_th']
				item['reservoir'].forEach(data_fil=>{
					data_fetch[data_fil.cresv] =  [data_fil.qdisc_curr,region]
				})
			})
		}

	});
}


function displayOnMapData(id, url, index, color='#008000', more = '',search_index){
	if(document.getElementById(id).checked){
		val[id] = new L.TopoJSON(null, {
			style: {
				fillColor : '#99ffcc',
				fillOpacity: 0,
		 		color:color,
		 		weight:2,
		 		opacity:1
		 	}, onEachFeature: function(feature, layer) {
					let tmp = feature
					let txt_tmp = ''
					if(index[0] != 'none'){
						index.forEach(item => {
							let tmp = feature
							item.forEach(it => {
								tmp = tmp[it]
							})
							console.log(tmp)
							txt_tmp += ' '+tmp
						})
						console.log(txt_tmp)
						if(more!=''){
							txt_tmp =more+' '+txt_tmp
						}
						let data_load = ''
						let tmp = feature
						console.log(tmp)
						console.log(search_index)
						search_index.forEach(item => {
							tmp = tmp[item]
						})
						console.log(tmp)
						try {
							layer.bindPopup('<b>'+txt_tmp.toString()+'</b><br>ระดับน้ำ '+data_fetch[tmp][0]+' ล้าน ล.บ.เมตร');
						} catch (e) {
							layer.bindPopup('<b>'+txt_tmp.toString()+'</b><br>ไม่พบข้อมูล');
						} finally {

						}

					}

		  }
		})

		$.getJSON(url).done(function(topoData){
			val[id].addData(topoData);
			val[id].addTo(map);
		})
	}else{
		console.log(val[id])
		map.removeLayer(val[id])
	}
}



function addText(position,text){
	let layout = L.circleMarker(position,{radius:0}).bindTooltip(text,{direction: "center",permanent:true, className: "tooltip-marker"}).addTo(map).openTooltip()
	group_tooltip.addLayer(layout)
}

function deleteText(){
	map.removeLayer(group_tooltip)
	group_tooltip = L.layerGroup().addTo(map)
}


function displayOnMapText(id, url, index,dataset,color = '#000',key_name){
	if(document.getElementById(id).checked){
		val[id] = new L.TopoJSON(null, {
			style: {
				fillColor : color,
				fillOpacity: 0,
		 		color:color,
		 		weight:2,
		 		opacity:1
		 	}, onEachFeature: function(feature, layer) {
				try {

						let tmp = feature
						let txt_tmp = ''
						index.forEach(item => {
							let tmp = feature
							item.forEach(it => {
								tmp = tmp[it]
							})
							console.log(tmp)
							txt_tmp += tmp
						})
						layer.bindPopup(txt_tmp);
						console.log(key_name)
						console.log(dataset[feature['properties'][key_name]])
						if(dataset[feature['properties'][key_name]]!=undefined){
							addText(dataset[feature['properties'][key_name]],feature['properties'][key_name])
						}

				} catch (e) {
				} finally {

				}

		  }
		})

		$.getJSON(url).done(function(topoData){
			val[id].addData(topoData);
			val[id].addTo(map);
		})
	}else{
		console.log(val[id])
		deleteText()
		map.removeLayer(val[id])
	}
}


function displayOnMapIconImg(id,url, icon, index,folder,key,limit,more,scale = [20, 20]){
	if(document.getElementById(id).checked){
		layout[id] = L.layerGroup().addTo(map)
		val[id] = new L.TopoJSON(null, {
			style: function(feature){
				return {
						color: "transparent",
						opacity: 0,
						weight: 0,
						fillColor: 'transparent',
						fillOpacity: 0.0
						}
				},
			onEachFeature: function(feature, layer) {
				if(true){//feature['properties'][key]=="0500001"
					marker[id] = L.marker(feature['geometry']['coordinates'].reverse(),{icon:new L.Icon({
						iconUrl: icon,
						iconSize: scale,
					})}).addTo(map)
					
						
						let tmp = feature
						let txt_tmp = ''
						index.forEach(item => {
							let tmp = feature
							item.forEach(it => {
								tmp = tmp[it]
							})
							txt_tmp += tmp
						})
						if(limit==1){
							marker[id].bindPopup("<p><img src='"+folder+"/"+feature['properties'][key]+".jpg' width='300px' id='"+id+"im'>")
							layout[id].addLayer(marker[id])
						}else{
							limit_page[id+'im'] = 1
							marker[id].bindPopup("<p>"+more+txt_tmp+"<p><p><img src='"+folder+"/"+feature['properties'][key]+"-1.jpg' width='300px' id='"+id+"im'><button onclick='changeImgN(\""+id+"im\",\""+folder+"/"+feature['properties'][key]+"\")'><i class='fa fa-backward'></i></button><button onclick='changeImgP(\""+id+"im\",\""+folder+"/"+feature['properties'][key]+"\","+limit+")'><i class='fa fa-forward'></i></button></p>")
							layout[id].addLayer(marker[id])
						}
						
					
				}
			}
		})
		$.getJSON(url).done(function(data){
			console.log(data)
			val[id].addData(data)
		})
	}else{
		console.log(val[id])
		map.removeLayer(layout[id])
	}
}

function changeImgP(id,path,max){
	if(limit_page[id]<max){
		limit_page[id] += 1
	}
	document.getElementById(id).src = path+"-"+limit_page[id]+".jpg"
}

function changeImgN(id,path){
	if(limit_page[id]>1){
		limit_page[id] -= 1
	}
	document.getElementById(id).src = path+"-"+limit_page[id]+".jpg"
}

function displayOnMapIcon(id,url, icon, index,scale = [20, 20]){
	if(document.getElementById(id).checked){
		layout[id] = L.layerGroup().addTo(map)
		val[id] = new L.TopoJSON(null, {
			style: function(feature){
				return {
						color: "transparent",
						opacity: 0,
						weight: 0,
						fillColor: 'transparent',
						fillOpacity: 0.0
						}
				},
			onEachFeature: function(feature, layer) {
				let lat_p = feature['geometry']['coordinates'][0], lng_p = feature['geometry']['coordinates'][1]
				if(lat_p > lng_p){
					let tm = lng_p
					lng_p = lat_p
					lat_p = tm
				}
				console.log(lng_p+":"+lat_p)
				marker[id] = L.marker([lat_p,lng_p],{icon:new L.Icon({
					iconUrl: icon,
					iconSize: scale,
				})}).addTo(map)
				let tmp = feature
				let txt_tmp = ''
				index.forEach(item => {
					let tmp = feature
					item.forEach(it => {
						tmp = tmp[it]
					})
					txt_tmp += tmp
				})
				marker[id].bindPopup('<p>'+txt_tmp+'</p>')
				layout[id].addLayer(marker[id])
			}
		})
		$.getJSON(url).done(function(data){
			val[id].addData(data)
		})
	}else{
		console.log(val[id])
		map.removeLayer(layout[id])
	}
}


function displayOnMapIconNR(id,url, icon, index,scale = [20, 20]){
	if(document.getElementById(id).checked){
		layout[id] = L.layerGroup().addTo(map)
		val[id] = new L.TopoJSON(null, {
			style: function(feature){
				return {
						color: "transparent",
						opacity: 0,
						weight: 0,
						fillColor: 'transparent',
						fillOpacity: 0.0
						}
				},
			onEachFeature: function(feature, layer) {
				marker[id] = L.marker([feature['geometry']['coordinates'][0],feature['geometry']['coordinates'][1]],{icon:new L.Icon({
					iconUrl: icon,
					iconSize: scale,
				})}).addTo(map)
				let tmp = feature
				let txt_tmp = ''
				index.forEach(item => {
					let tmp = feature
					item.forEach(it => {
						tmp = tmp[it]
					})
					txt_tmp += tmp
				})
				marker[id].bindPopup('<p>'+txt_tmp+'</p>')
				layout[id].addLayer(marker[id])
			}
		})
		$.getJSON(url).done(function(data){
			val[id].addData(data)
		})
	}else{
		console.log(val[id])
		map.removeLayer(layout[id])
	}
}

displayOnMap('Basin','http://localhost/mismun/json/Basin/Basin.json',[['properties','Basin_Name_T']],'#17181E','ลุ่มน้ำ')

for(let n = 1;n<5;n++){
	for(let i = 0; i < 5;i++){
		try {
			document.getElementsByClassName('item-group'+n)[i].addEventListener('click',function(){
				console.log('ss')
				if(document.getElementsByClassName('item-group'+n)[i].checked ==true){
					document.getElementById('group-list'+n).checked = true
				}else{
					document.getElementById('group-list'+n).checked = false
				}
			})
		} catch (e) {

		} finally {

		}
	}
	
}

function displayGrop(number){
	document.getElementsByClassName('sub-menu'+number)[0].style.display = 'block'
}

function hideGrop(number){
	document.getElementsByClassName('sub-menu'+number)[0].style.display = 'none'
}

function action_panel(element,number){
	if(element.checked){
		displayGrop(number)
	}else{
		hideGrop(number)
	}
}

for(let n=2;n<=20;n++){
	document.getElementsByClassName('sub-menu'+n)[0].style.display = 'none'
}

document.getElementsByClassName('menu-left')[0].style.left = '-400px'
toggleMenu()
function toggleMenu(){
	console.log('toggle menu')
	if(document.getElementsByClassName('menu-left')[0].style.left == '-400px'){
		document.getElementsByClassName('menu-left')[0].style.left = '0px'
	}else{
		document.getElementsByClassName('menu-left')[0].style.left = '-400px'
	}
}
