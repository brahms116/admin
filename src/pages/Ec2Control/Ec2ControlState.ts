import { RsOption, None, Some } from "../../shared";

interface ConstructorParams {
  isLoading?: boolean;
  publicIP?: RsOption<string>;
  buttonText?: string;
  buttonColor?: string;
  buttonDisabled?: boolean;
  statusText?: string;
}

interface ClassFields extends Required<ConstructorParams> {}

export interface Ec2ControlState extends ClassFields {}
export class Ec2ControlState {
  constructor(n: ConstructorParams) {
    const withDefaults: ClassFields = {
      publicIP: None(),
      isLoading: false,
      buttonText: "Start Instance",
      buttonColor: "success",
      buttonDisabled: false,
      statusText: "Stopped",
      ...n,
    };
    Object.assign(this, withDefaults);
  }

  loading(): Ec2ControlState {
    this.isLoading = true;
    this.buttonDisabled = true;
    this.buttonText = "Loading...";
    return this.copy();
  }

  stopped(): Ec2ControlState {
    return new Ec2ControlState({});
  }

  running(publicIP: string): Ec2ControlState {
    this.publicIP = Some(`Public IP: ${publicIP}`);
    this.statusText = "Running";
    this.isLoading = false;
    this.buttonDisabled = false;
    this.buttonText = "Stop Instance";
    this.buttonColor = "warning";
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
