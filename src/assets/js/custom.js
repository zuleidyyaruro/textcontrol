async function saveDocument() {

  // TXTextControl.saveDocument(TXTextControl.StreamType.RichTextFormat, --> formato rtf
  TXTextControl.saveDocument(TXTextControl.StreamType.HTMLFormat,
    function (e) {
      localStorage.setItem("datos", e.data)
    }
  );

}

function loadDocument(data) {
  console.log("load")
  TXTextControl.loadDocument(TXTextControl.StreamType.HTMLFormat,
    btoa(data));
}
