function buildMetadata(sample) {
    // @TODO: Complete the following function that builds the metadata panel
  
    /* Use `d3.json` to fetch the metadata for a sample
       Use d3 to select the panel with id of `#sample-metadata`
       @app.route("/metadata/<sample>") Line 52
    */ 
   var sampleJson
      d3.json(`/metadata/${sample}`).then((data) => {
       
        sampleJson = data;
        var sampleMetadata = d3.select("#sample-metadata"); 
       
      
      // Use `.html("") to clear any existing metadata
        sampleMetadata.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      //NOTE: iterating through an Object then append output as paragraphs 
        Object.entries(data).forEach(([key,value]) => {
            sampleMetadata.append("h6").text(`${key}:${value}`) // HTML -div id="sample-metadata" Line 29
       
          });

     // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);
    var sampleFreq = data.WFREQ;
    var data = [{
      domain: {x: [0, 1], y: [0, 1]}, 
      value: sampleFreq, 
      labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"], 
      title: {text: "Belly Button Washing Frequency<br> Scrubs per Week"},
      // title: {text: "Scrubs per Week"},
      type: "indicator", 
      // tyep: "gauge",
      mode: "gauge+number",
      series: [{
          "values":[17],
          "indicator":[-10,0,0,0,0.3],
          "text":"R-Base (neg value --> flat base)"
        }],
      gauge:{
        axis:{
          range: [null, 10],
          // labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"]
        },
        steps: [
          {range: [0,2], color: "rgb(232,226,202)"},
          {range: [2,4], color: "rgb(226,210,172)"},
          {range: [4,6], color: "rgb(223,189,139)"},
          {range: [6,8], color: "rgb(223,162,103)"},
          {range: [8,10], color: "rgb(226,126,64)"}
        ]}
    }
    ];

    var layout = {width: 450, height: 480};
 

    Plotly.newPlot("gauge", data, layout);

      });
}
  
  function buildCharts(sample) {
        /* @TODO: Use `d3.json` to fetch the sample data for the plots
        """Return `otu_ids`, `otu_labels`,and `sample_values`."""
        */   
      d3.json(`/samples/${sample}`).then((sampleData) => {

        //Declare Global variables: 
        var xAxis = sampleData.otu_ids;
        var yAxis = sampleData.sample_values;
        var labels = sampleData.otu_labels;

        var trace1 ={
            "x": xAxis,
            "y": yAxis,
            "text": labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: "Viridis"
              }
        };
        var data = [trace1];

      //apply the group bubble mode to the layout
      var layoutBubble ={
        // title: "Bubble Chart: Belly Button Bacteria",
        xAxis: {title: "OTU ID"},
        height: 600, 
        width: 1200
        };
      // @TODO: Build a Bubble Chart using the sample data
      Plotly.newPlot("bubble", data, layoutBubble);




      // @TODO: Build a Pie Chart
      // HINT: You will need to use slice() to grab the top 10 sample_values,
      // otu_ids, and labels (10 each).
  
      var topTen = sampleData.sample_values.slice(0,10);
      var tenLabels = sampleData.otu_ids.slice(0,10);
      var tenText = sampleData.otu_labels.slice(0,10);

      var trace2 =[{
          "values": topTen, 
          "labels": tenLabels,
          "hovertext": tenText,
          "hole": .4,
          "type": 'pie',
          "textfont":{"color":"rgb(255, 255, 255)"},
          "textinfo":"labels"

      }];
   
      var dataPie = [trace2];  
      var layoutPie ={
        // title: "Pie Chart: Top 10 Belly Button Bacteria",
        height: 400,
        width: 500
      }

      Plotly.newPlot("pie", trace2, layoutPie);
    });
  };

  
  function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }

  // Initialize the dashboard
  init();

