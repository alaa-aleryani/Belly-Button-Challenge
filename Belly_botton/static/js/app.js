// NOTES: D3 is a visualization library written in JavaScript. We use it create interactive data visualizations in browswers.
// D3 FOR Data Driven Documents.
// D3 is a very LARGE library.
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// Import sampeles.json file Using the D3 library using the json file or the **https link**
// setting the url to be constant not changeable.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// ---------------------------------------------------------------------------------
// Display the sample metadata, i.e., an individual's demographic information.
function demoInfoBox(id) {
    d3.json(url).then(function(data) {
        console.log(data);
      
        // NOTE: a set of data that describes and gives information about other data.
        metaData = data.metadata  // no need for `let` b/c it will restrict it to be local
        let resultArray = metaData.filter(sampleObj => sampleObj.id == id);
        let result = resultArray[0];

        // Getting a reference to the button on the page with the id property set to `Demographic Info` box.
        let demoInfo = d3.select("#sample-metadata")
        demoInfo.html("")

        for (key in result) {
            demoInfo.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
          };
    })
};

// ----------------------------------------------------------------------------------
// Display each key-value pair from the metadata JSON object somewhere on the page.
// Crete the dropdown menu.
d3.json(url).then(function(data) {
  console.log(data);

  names = data.names  
  // Getting a reference to the button on the page with the id property set to `drop down arrow`
  let dropdown = d3.select("#selDataset") 

  for (let i = 0; i < names.length; i++) {
    dropdown
      .append("option")  // TAG NAMED OPTION
      .text(names[i])
      .property("value", names[i]);
  };

  demoInfoBox(names[0])  // passing 940  // javaScript it is okay to call a function before declaring it.
  buildCharts(names[0]) // Calling the functions
});
// -------------------------------------------------------------------------------------------
// Update all the plots when a new sample is selected. 
function optionChanged(id) {
    demoInfoBox(id)
};

// -----------------------------------------------------------------------------------------------
//                                    Create A chart Function                                     //
// -----------------------------------------------------------------------------------------------
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.

// Use sample_values as the values for the bar chart.
function buildCharts(id) {
    d3.json(url).then(function(data)  {
      
        samplesData = data.samples;  

        // filter the samples data
        let resultArray = samplesData.filter(sampleObj => sampleObj.id == id);
        // Assigning the first value in the filtered data to a variable
        let result = resultArray[0];

        // Create variables for sample_values, otu_ids, and otu_labels
        let otuIds = result.otu_ids;
        let otuLabels = result.otu_labels;
        let sampleValues = result.sample_values;
//-----------------------------------------------------------------//
//                      Bar Chart                                  //
//-----------------------------------------------------------------//
        let barTrace = {
            x: sampleValues.slice(0,10).reverse(),
            // Use otu_ids as the labels for the bar chart.
            y: otuIds.slice(0,10).map(id => `OTU ${id}`).reverse(),
            // Use otu_labels as the hovertext for the chart.
            text: otuLabels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
            };       
        // ----------------------
        // Crete the bar layout
        let barLayout = {
            title: "Bar Chart"
        };
        // ----------------------
        // Display the bar chart
        let data1 = [barTrace];
        let layout = barLayout;
        Plotly.newPlot("bar", data1, layout);

//-----------------------------------------------------------------//
//                          Bubble Chart                           //
//-----------------------------------------------------------------//
    // Create a bubble chart that displays each sample.
    let bubbleTrace = {
    // Use otu_ids for the x values.
        x: otuIds,
    // Use sample_values for the y values.
        y: sampleValues,
    // Use sample_values for the marker size.
        marker: {size: sampleValues,
    // Use otu_ids for the marker colors.
                color: otuIds},
    // Use otu_labels for the text values.
        text: otuLabels,
        mode: "markers"  // To make in bubbles form
    };

    // -------------------------
    // Create the bubble layout
    let bubbleLayout = {
        title: "Bubble Chart",
        xaxis: {title: "OTU IDs"}
    };

    // Display the Bubble chart
    let data2 = [bubbleTrace];
    let layout2 = bubbleLayout;
    Plotly.newPlot("bubble", data2, layout2);
    });
};
// -----------------------------------------------------------------------------------------------
// // Additionally, you are welcome to create any layout that you would like for your dashboard. 


