import { RsOption, RsResult } from "../../shared";
import { AdminErr } from "../AdminErr";

export enum Ec2Status {
  On = "On",
  Off = "Off",
  Pending = "Pending",
  Terminated = "Terminated",
  Unknown = "Unknown",
}

export interface Ec2State {
  status: Ec2Status;
  ip: RsOption<string>;
}

export interface Ec2Control {
  turnEc2On(): Promise<RsResult<Ec2State, AdminErr>>;
  ec2Status(): Promise<RsResult<Ec2State, AdminErr>>;
  turnEc2Off(): Promise<RsResult<Ec2State, AdminErr>>;
}
