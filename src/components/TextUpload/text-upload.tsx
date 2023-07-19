import React, { useState } from "react";

function TextUpload() {
  const [fileContent, setFileContent] = useState("");

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      // const content = e.target.result;
      // setFileContent(content);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".txt" onChange={handleFileUpload} />
      {fileContent && <textarea value={fileContent} readOnly />}
    </div>
  );
}

export default TextUpload;
