require()

var svg = d3.select("body")
  .append("svg")
  .append("g")

svg.append("g")
  .attr("class", "slices");
svg.append("g")
  .attr("class", "labels");
svg.append("g")
  .attr("class", "lines");

var width = 960,
    height = 450,
  radius = Math.min(width, height) / 2;

var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) {
    return d.value;
  });

var arc = d3.svg.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);

svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var key = function(d){ return d.data.label; };

var color = d3.scale.ordinal()
  .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);



function dataObjectCreator (){
  var labels = color.domain();

  var values = [12,45,33,42,56,21,15,15,66,33,11]
  var index = -1

  return labels.map(function(label){
    index++
    return { label: label, value: values[index] }
  });
}

console.log(dataObjectCreator());

change(dataObjectCreator());

d3.select(".randomize")
  .on("click", function(){
    change(dataObjectCreator());
  });


function change(data) {

  /* ------- PIE SLICES -------*/
  var slice = svg.select(".slices").selectAll("path.slice")
    .data(pie(data), key);

  slice.enter()
    .insert("path")
    .style("fill", function(d) { 
      // console.log(d);
      return color(d.data.label); })
    .attr("class", "slice");

    // var tooltipValue = d3.select(this).data.value;
    var globalD

    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function() {
      return "<strong>Value:</strong> <span style='color:red'>" + globalD.data.value + "</span>";
    })

    svg.call(tip);


  slice
    .on("mouseover", function(d) {
      globalD = d
      var endAngle = d.endAngle + 0.2;
      var startAngle = d.startAngle - 0.2;

      var arcOver = d3.svg.arc()
        .outerRadius(radius + 9).endAngle(endAngle).startAngle(startAngle);

      var strokeColor = d3.select(this).style("fill");


      tip.show()
      d3.select(this)
        .style("stroke", strokeColor)
        .transition()
        .duration(250)
        // .attr("d", arcOver)   
        .style("stroke-width", 15)          
    })
    .on("mouseout", function(d) {
      var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function() {
        return "";
      })

      svg.call(tip);
      tip.hide();
      d3.select(this)
        .style("stroke", "none")
        .transition()
        .duration(500)
        // .attr("d", )
        .style("stroke-width", 0)
    })


  slice   
    .transition().duration(1000)
    .attrTween("d", function(d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return arc(interpolate(t));
      };
    })

  slice.exit()
    .remove();

  /* ------- TEXT LABELS -------*/

  var text = svg.select(".labels").selectAll("text")
    .data(pie(data), key);

  text.enter()
    .append("text")
    .attr("dy", ".35em")
    .text(function(d) {
      return d.data.label;
    });
  
  function midAngle(d){
    return d.startAngle + (d.endAngle - d.startAngle)/2;
  }

  text.transition().duration(1000)
    .attrTween("transform", function(d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
        return "translate("+ pos +")";
      };
    })
    .styleTween("text-anchor", function(d){
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        return midAngle(d2) < Math.PI ? "start":"end";
      };
    });

  text.exit()
    .remove();

  /* ------- SLICE TO TEXT POLYLINES -------*/

  var polyline = svg.select(".lines").selectAll("polyline")
    .data(pie(data), key);
  
  polyline.enter()
    .append("polyline");

  polyline.transition().duration(1000)
    .attrTween("points", function(d){
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        return [arc.centroid(d2), outerArc.centroid(d2), pos];
      };      
    });
  
  polyline.exit()
    .remove();
};