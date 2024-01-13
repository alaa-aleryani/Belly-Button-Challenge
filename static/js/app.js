// NOTES: D3 is a visualization library written in JavaScript. 
// We use it create interactive data visualizations in browswers.
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// Import sampeles.json file Using the D3 library and the **https link**
// Setting the url to be constant not changeable.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// ---------------------------------------------------------------------------------
// Create the dropdown menu.                                                      //
// ---------------------------------------------------------------------------------
// Assign the dataset given in the url to a variable named "data"
// Take the json file (url) and convert it into an array of objects
// And log the dataset in the console.
d3.json(url).then(function(data) {
    console.log(data);    
  
    // Save the names from the data to a variable named "names"
    let names = data.names  

    // Getting a reference to the button on the website with the id property set to `dropdown arrow`
    // Select the first HTML matching element "id selDataset"
    let dropdown = d3.select("#selDataset")   
  
    // Loop through the names and add each name to the dropdown menu
    for (let i = 0; i < names.length; i++) {
      dropdown
        .append("option")  
        .text(names[i])
        .property("value", names[i]); 
    };
  
    // passing 940 -- 1st element in the names array -- as the default value
    // for both the demographic Info box and the drop down box.
    demoInfoBox(names[0])  
    buildCharts(names[0]) 
  });

// ---------------------------------------------------------------------------------
// Create the Demographic Information Box.                                        //
// ---------------------------------------------------------------------------------
// Display the sample metadata, i.e., an individual's demographic information.
function demoInfoBox(id) {
    d3.json(url).then(function(data) { 
        console.log(data); 

        // Save the metadata array of objects from the data variable to a variable named "metaData"
        let metaData = data.metadata  

        // filter the metaData 
        let resultArray = metaData.filter(sampleObj => sampleObj.id == id);
        let result = resultArray[0];

        // Getting a reference to the box on the page with the id property set to `Demographic Info`.
        let demoInfo = d3.select("#sample-metadata")
        demoInfo.html("") 

        for (key in result) {
            // When appending to the demoInfo Box set the key to be in upper case.
            demoInfo.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
          };
    })
};

// --------------------------------------------------------
// Update all the plots when a new sample is selected. 
function optionChanged(id) {
         demoInfoBox(id) 
         buildCharts(id)};

// -----------------------------------------------------------------------------------------------
//                                    Create A chart Function                                     //
// -----------------------------------------------------------------------------------------------
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
function buildCharts(id) {
    d3.json(url).then(function(data)  {
      console.log(data); 

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
            title: "Bar Chart",
            // resize the chart
            height: 430, 
            width: 500
        };
        // ----------------------
        // Display the bar chart
        let data1 = [barTrace];
        let layout = barLayout;
        Plotly.newPlot("bar", data1, layout); 
          // NOTE: "bar" ^ here refers to the html div id.

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
                color: otuIds,
                colorscale: "Earth" // or "Earth" , "YlGnBu", "Viridis"
              },
        // Use otu_labels for the text values.
        text: otuLabels, // Hovertext values
        mode: "markers"  // To make in bubbles form
    };

    // -------------------------
    // Create the bubble layout
    let bubbleLayout = {
        title: "Bubble Chart",
        xaxis: {title: "OTU IDs"},
        yaxis: {title: "Sample Values"}
    };

    // -------------------------
    // Display the Bubble chart
    let data2 = [bubbleTrace];
    let layout2 = bubbleLayout;
    Plotly.newPlot("bubble", data2, layout2);
    });
};


