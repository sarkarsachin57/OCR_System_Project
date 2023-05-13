var file_type = document.getElementById('file_type')
var input_file = document.getElementById('input_file')
var start = document.getElementById('start')
var progress = document.getElementById('progress')
var showtext = document.getElementById('showtext')
var download = document.getElementById('Download')

// import * as fs from '/fs.js';


file_type.onchange = () => {
    var file_type_value = file_type.value;
    console.log(file_type_value);
}

input_file.onchange = () => {
    var filename = input_file.files[0].name;
    progress.innerHTML = "File "+ filename +" Uploaded Successfully!"
}


function downloadFile(filename, content) {
    // It works on all HTML5 Ready browsers as it uses the download attribute of the <a> element:
    const element = document.createElement('a');
    
    //A blob is a data type that can store binary data
    // "type" is a MIME type
    // It can have a different value, based on a file you want to save
    const blob = new Blob([content], { type: 'plain/text' });
  
    //createObjectURL() static method creates a DOMString containing a URL representing the object given in the parameter.
    const fileUrl = URL.createObjectURL(blob);
    
    //setAttribute() Sets the value of an attribute on the specified element.
    element.setAttribute('href', fileUrl); //file location
    element.setAttribute('download', filename); // file name
    element.style.display = 'none';
    
    //use appendChild() method to move an element from one element to another
    document.body.appendChild(element);
    element.click();
    
    //The removeChild() method of the Node interface removes a child node from the DOM and returns the removed node
    document.body.removeChild(element);
  };
  


start.onclick = () => {
    if (file_type.value == "IMAGE") {
        console.log("File Type got IMAGE")
        const rec = new Tesseract.TesseractWorker();
        rec.recognize(input_file.files[0])
            .progress(function (response) {
                progress.innerHTML = "Processing, Please wait..."
            })
            .then(function (data) {
                showtext.innerHTML = data.text
                progress.innerHTML = "Processing Completed!"
                console.log("Recognized Text :", data.text);
                // downloadFile("output", data.text)
                // const blob = new Blob([data.text], { type: 'plain/text' });
                // const fileUrl = URL.createObjectURL(blob);
                window.text_from_image = data.text;

        })
    }
    else {
        console.log("File Type got PDF")
        progress.innerHTML = "Processing, Please wait..."
        const formData = new FormData();
        formData.append("file", input_file.files[0]);
        const requestOptions = {
            headers: {
                "Content-Type": input_file.files[0].contentType, // This way, the Content-Type value in the header will always match the content type of the file
            },
            mode: "no-cors",
            method: "POST",
            files: input_file.files[0],
            body: formData,
        };
        console.log(requestOptions);
    
        fetch("/upload_pdf", requestOptions)
        .then((resp) => resp.json())
        .then(function(response) {
            console.info('fetch()', response);
            showtext.innerHTML = response['data'];
            progress.innerHTML = "Processing Completed!";
        });

    }
}


download.onclick = () => {
    if (file_type.value == "IMAGE") {
        downloadFile("output", window.text_from_image)
    }
    else {
        const element = document.createElement('a');
        element.setAttribute('href', "/output.docx");
        element.setAttribute('download', "output.docx");
        element.click();
    }
}