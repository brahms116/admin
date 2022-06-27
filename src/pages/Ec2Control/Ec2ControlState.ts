import { Ec2Status } from "../../lib";
import { RsOption, None, Some } from "../../shared";

interface ConstructorParams {
  isLoading?: boolean;
  publicIP?: RsOption<string>;
  buttonText?: string;
  buttonColor?: string;
  buttonDisabled?: boolean;
  statusText?: string;
  ec2Status?: Ec2Status;
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
      ec2Status: Ec2Status.Off,
      ...n,
    };
    Object.assign(this, withDefaults);
  }

  loading(): Ec2ControlState {
    this.isLoading = true;
    this.buttonDisabled = true;
    this.buttonText = "Loading...";
    this.ec2Status = Ec2Status.Pending;
    return this.copy();
  }

  stopped(): Ec2ControlState {
    return new Ec2ControlState({});
  }

  running(publicIP: string): Ec2ControlState {
    this.publicIP = Some(`Public IP: ${publicIP}`);
    this.statusText = "Running";
    this.ec2Status = Ec2Status.On;
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
      ec2Status: this.ec2Status,
      buttonDisabled: this.buttonDisabled,
      buttonColor: this.buttonColor,
      statusText: this.statusText,
    });
  }
}
