import React, { useEffect, useState } from 'react';
import ReactFileViewer from 'react-file-viewer';
import mammoth from 'mammoth';

const Lesson = () => {
  const [docxContent, setDocxContent] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    // Fetch the binary content from the backend API running on port 3003
    fetch('http://localhost:3003/getDocxContent')
      .then(response => response.arrayBuffer())
      .then(binaryContent => {
        // Convert the binary content to a Blob
        const blob = new Blob([binaryContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        setDocxContent(blob);
      })
      .catch(error => console.error('Error fetching .docx content:', error));
  }, []);

  const readText = () => {
    if (docxContent) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result;
        // Convert the array buffer to text using mammoth
        mammoth.extractRawText({ arrayBuffer })
          .then(result => {
            const text = result.value;
            speak(text);
          })
          .catch(error => console.error('Error extracting text from DOCX:', error));
      };
      reader.readAsArrayBuffer(docxContent);
    }
  };

  const speak = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => {
      setSpeaking(true);
      setHighlightedIndex(0);
    };

    utterance.onboundary = (event) => {
      const index = event.charIndex;
      setHighlightedIndex(index);
    };

    utterance.onend = () => {
      setSpeaking(false);
      setHighlightedIndex(-1);
    };

    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setHighlightedIndex(-1);
  };

  return (
    <div className='lesson-content' style={{height:"500px", overflowY:"auto"}}>
      {docxContent && (
        <>
          <ReactFileViewer
            fileType='docx'
            filePath={URL.createObjectURL(docxContent)}
          />
          <button style={{ color: 'red', backgroundColor: 'black' }} onClick={readText}>Read Text</button>
          {speaking && <button style={{ color: 'white', backgroundColor: 'red' }} onClick={stopSpeaking}>Stop</button>}
          <div style={{ marginTop: '10px', padding: '5px', backgroundColor: 'yellow' }}>
            {highlightedIndex !== -1 &&
              <span>
                {docxContent.text.slice(0, highlightedIndex)}
                <span style={{ backgroundColor: 'lightblue' }}>
                  {docxContent.text.slice(highlightedIndex, highlightedIndex + 1)}
                </span>
                {docxContent.text.slice(highlightedIndex + 1)}
              </span>
            }
          </div>
        </>
      )}
    </div>
  );
};

export default Lesson;
