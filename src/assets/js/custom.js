

async function saveDocument() {

  TXTextControl.saveDocument(TXTextControl.StreamType.RichTextFormat,
    // TXTextControl.saveDocument(TXTextControl.StreamType.HTMLFormat,
    function (e) {
      console.log(1)
      localStorage.setItem("datos", e.data)
    }
  );

}

function loadDocument(data) {
  TXTextControl.loadDocument(TXTextControl.StreamType.RichTextFormat,
    btoa(data));
}
