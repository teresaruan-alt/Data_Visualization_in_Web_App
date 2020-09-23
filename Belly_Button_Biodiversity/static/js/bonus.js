


//Build metadata 
function buildmetadata(sample){

    //Read route (`/metadata/${sample}`) in json format then return in array under (data)
    d3.json(`/metadata/${sample}`).then((data)=> {
        var sampleJson = data;
        console.log("metaData", data);
        console.log("data", data);

        var sampleMatadata =d3.select("#sample-metadata");
        console.log("sampleMetadata", sampleMetadata);


        // Use `.html("") to clear any existing metadata
        sampleMetadata.html("");

        // Use 'Object.entries' to add each key value pair to the panel from (data) array
        Object.defineProperties(data).forEach(([key, value]) =>{

            //html line 31: id= "sample-metadata"
            sampleMeta.append("h6").text(`${key}:${value}`)
        });


    })

}

function buildCharts(sample){

}
