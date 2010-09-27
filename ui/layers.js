var dbUrl="http://blanu.net/nui-map";
var retry=true;
var oldLayers=[];
var firstGesture=true;
var names={0:'red', 4:'blue', 6:'green', 7:'yellow'};

function startLayers()
{
  toggleGroup('red');
  toggleGroup('blue');
  toggleGroup('green');
  toggleGroup('yellow');
  watchLayers(1);
}

function watchLayers(since)
{
  var url=dbUrl+"/_changes?feed=longpoll&since="+since;
//  alert('watching '+url);
  
  $.getJSON(url, function(data) {
    results=data.results;
    for(var x=0; x<results.length; x++)
    {
      result=results[x];
      since=result.seq;      
      if(result.id=='layers')
      {
        fetchLayers();
      }
      else if(result.id=='gestures')
      {
        fetchGestures();
      }
    }

    watchLayers(since);
  });
}

function fetchLayers()
{
  var url=dbUrl+"/layers";

  $.getJSON(url, function(data) {
    layers=data.data
    //alert("new layers "+layers);
    $("#layers").empty().append(layers.join(", "));
    
    for(var x=0; x<layers.length; x++)
    {
      id=layers[x];
      if(oldLayers.indexOf(id)==-1)
      {
        type=names[id];
        if(type===undefined)
        {
          log("undefined layer: "+id);
        }
        else
        {
          toggleGroup(type);
        }
      }
    }
    
    for(var x=0; x<oldLayers.length; x++)
    {
      id=oldLayers[x];
      if(layers.indexOf(id)==-1)
      {
        type=names[id];
        if(type===undefined)
        {
          log("undefined layer: "+id);
        }
        else
        {
          toggleGroup(type);
        }
      }
    }
    
    oldLayers=layers;
  });  
}

function fetchGestures()
{
  log('fetch gestures');
  var url=dbUrl+"/gestures";

  $.getJSON(url, function(data) {
    gestures=data.gestures;
    log("new gestures "+gestures);

    if(gestures.length>0)
    {
      gesture=gestures[gestures.length-1];
      if(firstGesture)
      {
        firstGesture=false;
      }
      else if(gesture.type=='swipe')
      {
        pan(gesture.vector);
      }      
      else if(gesture.type=='pinch')
      {
        zoom(gesture.scale);
      }      
      else
      {
        log('unknown gesture:', gesture.type);
      }
    }
  });
}

$(document).ready(startLayers);
