/**
 * Injection identifiers
 */
export type containerSymbol = {
  AwsDocumentClient: symbol;
  InitService: symbol;
};

const IDENTIFIERS: containerSymbol = {
  AwsDocumentClient: Symbol.for("AwsDocumentClient"),
  InitService: Symbol.for("InitService"),
};

export { IDENTIFIERS };
