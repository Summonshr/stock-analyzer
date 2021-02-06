import { toJpeg } from "html-to-image";

export default function() {
  var node = document.getElementById('capture');

  toJpeg(node)
    .then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = prompt('Name please');
      link.href = dataUrl;
      link.click();
    });
}
