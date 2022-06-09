import { RsOption, None } from "../../shared";

interface ConstructorParams {
  isLoading: boolean;
  publicIP?: RsOption<string>;
  buttonText: string;
  buttonColor: string;
  buttonDisabled: boolean;
  statusText: string;
}

interface ClassFields extends Required<ConstructorParams> {}

export interface Ec2ControlState extends ClassFields {}
export class Ec2ControlState {
  constructor(n: ConstructorParams) {
    const withDefaults: ClassFields = { publicIP: None(), ...n };
    Object.assign(this, withDefaults);
  }

  beginLoading(): Ec2ControlState {
    this.isLoading = true;
    this.buttonDisabled = true;
    this.buttonText = "Loading...";
    return this.copy();
  }

  copy(): Ec2ControlState {
    return new Ec2ControlState({
      isLoading: this.isLoading,
      publicIP: this.publicIP,
      buttonText: this.buttonText,
      buttonDisabled: this.buttonDisabled,
      buttonColor: this.buttonColor,
      statusText: this.statusText,
    });
  }
}
