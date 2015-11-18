app.



directive("hi", function() {
  return {
    template: "<pre>
      var inputLabels = {{inputLabels}};
      var inputValues = {{inputValues}};

      var svg = d3.select(&quot;#bodyCanvas&quot;)
            .append(&quot;svg&quot;)
            .append(&quot;g&quot;)

          svg.append(&quot;g&quot;)
            .attr(&quot;class&quot;, &quot;slices&quot;);
          svg.append(&quot;g&quot;)
            .attr(&quot;class&quot;, &quot;labels&quot;);
          svg.append(&quot;g&quot;)
            .attr(&quot;class&quot;, &quot;lines&quot;);

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

          svg.attr(&quot;transform&quot;, &quot;translate(&quot; + width / 2 + &quot;,&quot; + height / 2 + &quot;)&quot;);

          var key = function(d){ return d.data.label; };

          var color = d3.scale.ordinal()
            .domain(inputLabels)
            .range([&quot;#98abc5&quot;, &quot;#8a89a6&quot;, &quot;#7b6888&quot;, &quot;#6b486b&quot;, &quot;#a05d56&quot;, &quot;#d0743c&quot;, &quot;#ff8c00&quot;]);

          function dataObjectCreator (){
            var labels = color.domain();

            var values = inputValues
            var index = -1

            return labels.map(function(label){
              index++
              return { label: label, value: values[index] }
            });
          }

          change(dataObjectCreator());

          function change(data) {

            /* ------- PIE SLICES -------*/
            var slice = svg.select(&quot;.slices&quot;).selectAll(&quot;path.slice&quot;)
              .data(pie(data), key);

            slice.enter()
              .insert(&quot;path&quot;)
              .style(&quot;fill&quot;, function(d) { 
                return color(d.data.label); })
              .attr(&quot;class&quot;, &quot;slice&quot;);

              var globalD;

              var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function() {
                return &quot;&lt;strong&gt;&lt;em&gt;&quot; + globalD.data.label +&quot;:&lt;/em&gt;&lt;/strong&gt; &quot; + globalD.data.value;
              })

              svg.call(tip);

            slice
              .on(&quot;mouseover&quot;, function(d) {
                globalD = d

                var strokeColor = d3.select(this).style(&quot;fill&quot;);

                tip.show()
                d3.select(this)
                  .style(&quot;stroke&quot;, strokeColor)
                  .transition()
                  .duration(250)
                  .style(&quot;stroke-width&quot;, 15)          
              })
              .on(&quot;mouseout&quot;, function(d) {
                var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function() {
                  return &quot;&quot;;
                })

                svg.call(tip);
                tip.hide();
                d3.select(this)
                  .style(&quot;stroke&quot;, &quot;none&quot;)
                  .transition()
                  .duration(500)
                  .style(&quot;stroke-width&quot;, 0)
              })

            slice   
              .transition().duration(1000)
              .attrTween(&quot;d&quot;, function(d) {
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

            var text = svg.select(&quot;.labels&quot;).selectAll(&quot;text&quot;)
              .data(pie(data), key);

            text.enter()
              .append(&quot;text&quot;)
              .attr(&quot;dy&quot;, &quot;.35em&quot;)
              .text(function(d) {
                return d.data.label;
              });
            
            function midAngle(d){
              return d.startAngle + (d.endAngle - d.startAngle)/2;
            }

            text.transition().duration(1000)
              .attrTween(&quot;transform&quot;, function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                  var d2 = interpolate(t);
                  var pos = outerArc.centroid(d2);
                  pos[0] = radius * (midAngle(d2) &lt; Math.PI ? 1 : -1);
                  return &quot;translate(&quot;+ pos +&quot;)&quot;;
                };
              })
              .styleTween(&quot;text-anchor&quot;, function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                  var d2 = interpolate(t);
                  return midAngle(d2) &lt; Math.PI ? &quot;start&quot;:&quot;end&quot;;
                };
              });

            text.exit()
              .remove();

            /* ------- SLICE TO TEXT POLYLINES -------*/

            var polyline = svg.select(&quot;.lines&quot;).selectAll(&quot;polyline&quot;)
              .data(pie(data), key);
            
            polyline.enter()
              .append(&quot;polyline&quot;);

            polyline.transition().duration(1000)
              .attrTween(&quot;points&quot;, function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                  var d2 = interpolate(t);
                  var pos = outerArc.centroid(d2);
                  pos[0] = radius * 0.95 * (midAngle(d2) &lt; Math.PI ? 1 : -1);
                  return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };      
              });
            
            polyline.exit()
              .remove();
          };


        }
    </pre>"
  }
})