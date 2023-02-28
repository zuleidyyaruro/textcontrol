function saveDocument() {

  TXTextControl.saveDocument(TXTextControl.StreamType.HTMLFormat,
    function (e) {
      console.log(e)
    });

}

function loadDocument() {
  console.log("load")
  TXTextControl.loadDocument(TXTextControl.StreamType.HTMLFormat,
    btoa('<strong>Jazmin</strong>'));
}
