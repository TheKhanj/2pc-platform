const query =
  '.123.a.b.khanjj["khansjdf"].manj["TANJ"].tanj[\'juranj\']["TANJULLLL"]["MANU"]';
function convertQueryToArr(query: string): string[] {
  const singleQuoteMatch = /'[^']+'/;
  const doubleQuoteMatch = /"[^"]+"/;
  const quoteMatch = new RegExp(
    `(${singleQuoteMatch.source}|${doubleQuoteMatch.source})`,
  );
  const arrayMatch = new RegExp(`\\[${quoteMatch.source}\\]`);
  const dotMatch = /(\.[^\.\[\]]+)/;
  const selectorMatch = new RegExp(
    `(${dotMatch.source}|${arrayMatch.source})`,
    'g',
  );

  return (
    query.match(selectorMatch)?.map((key) => {
      if (key.match(dotMatch)) {
        return key.slice(1);
      }
      return key.split(/["']/)[1];
    }) || []
  );
}

console.log(convertQueryToArr(query));
