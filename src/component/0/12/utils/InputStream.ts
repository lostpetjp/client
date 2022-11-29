export abstract class InputStream {
  constructor() { }
  public abstract readByte(): number;
  public close(): void {
  }
}