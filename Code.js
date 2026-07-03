function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('CheckFrota GB')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(file) {
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}