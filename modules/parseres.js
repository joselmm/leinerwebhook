const he = require("he");
function extractAndEncodeHTMLCode(text) {
  //remover lo que estan entre ``` y ```
  text = text.replace(/```\n?.+[^ ]\n/g, "```");
  //console.log(text);
  var regex = /```(.*\n)+```/g;
  var regexMatches = text.match(regex);
  if (regexMatches !== null && regexMatches.length >= 1) {
    for (let i = 0; i < regexMatches.length; i++) {
      text = text.replace(
        regexMatches[i],
        "<pre>" + he.encode(regexMatches[i].slice(3, -3)) + "</pre>"
      );
    }
  }

  //remover lo que estan entre ` y `
  var regex = /`([^`]*)`/g;
  var regexMatches = text.match(regex);
  if (regexMatches !== null && regexMatches.length >= 1) {
    for (let i = 0; i < regexMatches.length; i++) {
      text = text.replace(
        regexMatches[i],
        he.encode(regexMatches[i].slice(1, -1))
      );
    }
  }
  return text;
}

function fixMarkdownTableInText(text) {
  text = text + "\n";
  //var tableRegex = /\|.*\|.*\|.*\|\n\|(-+\|)+(-+\|)+(-+\|)+\n(\|.*\|\n)+/g; //solo para tablas de 3 columnas
  var tableRegex = /(\|.*)+\|\n(\| *-+ *)+\|\n((\|.*\|+\n)+)/g;
  return text.replace(tableRegex, (markdownTable) => {
    var coincidencia = markdownTable.slice(0, -1);
    var result = fixMarkdownTable(coincidencia);
    console.log(result);
    return result;
  });
}

function fixMarkdownTable(markdown) {
  // Separar las filas de la tabla
  const rows = markdown.trim().split("\n");

  // Encontrar la longitud máxima de cada columna
  const columnLengths = rows.reduce((lengths, row) => {
    const columns = row.split("|").map((col) => col.trim());
    columns.forEach((col, i) => {
      if (col.length > lengths[i]) {
        lengths[i] = col.length;
      }
    });
    return lengths;
  }, new Array(rows[0].split("|").length).fill(0));

  // Construir la nueva tabla con las celdas centradas
  const fixedRows = rows.map((row) => {
    const columns = row.split("|").map((col) => col.trim());
    const fixedColumns = columns.map((col, i) => {
      const padding = " ".repeat(columnLengths[i] - col.length);
      return `${col}${padding}`;
    });
    return `${fixedColumns.join("|")}`;
  });

  // Unir las nuevas filas para formar la tabla completa
  var previo = fixedRows.join("\n") + "\n";
  return `<pre>${previo}</pre>`;
}

module.exports = {
  fixMarkdownTableInText,
  extractAndEncodeHTMLCode,
};
