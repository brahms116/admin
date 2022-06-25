export interface TextFieldControl {
  getField(): string;
  setField(str: string): void;
  getFieldErr(): string;
  setFieldErr(err: string): void;
}
