async function saveDocument() {

  TXTextControl.saveDocument(TXTextControl.StreamType.RichTextFormat,
    // TXTextControl.saveDocument(TXTextControl.StreamType.HTMLFormat,
    function (e) {
      localStorage.setItem("datos", e.data)
    }
  );

}

function loadDocument(data) {
  console.log("load")
  TXTextControl.loadDocument(TXTextControl.StreamType.RichTextFormat,
    btoa(data));
}
