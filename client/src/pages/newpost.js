import React from "react";
import './newpost.css'

//https://www.educative.io/edpresso/file-upload-in-react
function FileUpload() {
  
  const [file, setFile] = React.useState("");

  function handleUpload(event) {
    setFile(event.target.files[0]);
  }

    function post() {
        if (file.type === "image/jpeg" || file.type === "image/png") {
            var formData = new FormData();
            formData.append("file", file, file.name);

            var xhr = new XMLHttpRequest();

            xhr.open("POST", "http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/newpost", true);

            xhr.onreadystatechange = function () {  
                if (xhr.readyState === 4 && xhr.status === 200) {  
                    //self.setState({imgkey: xhr.responseText})
                    send(xhr.responseText);
                    document.getElementById("upload-box").style.display = "none";
                    document.getElementById("caption").value = "";
                    setFile('');
                    window.location.reload();
                }  
            };

            xhr.send(formData);
        }
        else {
            alert("Please select valid image with a JPEG or PNG filetype.");
            setFile('');
        }
    }

    function send(imgtag) {
      fetch('http://ec2-3-14-152-126.us-east-2.compute.amazonaws.com:9000/testAPI/newpostdatabase' , {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
          username: document.getElementById("hiddenUsername").value,
          imgtag: imgtag,
          likes: 0,
          caption: document.getElementById("caption").value
        })
      })
    }

  return (
    <div id="upload-box"  >
        <label>
            image:
            <input type="file" onChange={handleUpload} />
        </label>
        {file && <ImageThumb image={file} />}
        <label id="caption-label">
            Caption:
            <textarea id="caption" type="text"/>
        </label>
        <button id="postbtn" onClick={post} >Post</button>
    </div>
  );
}

const ImageThumb = ({ image }) => {
  return <img src={URL.createObjectURL(image)} alt={image.name} height="50"/>;
};


export default function App() {
  return <FileUpload />;
}