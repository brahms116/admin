import { z } from "zod";
import { Opt, RsOption, RsResult, Some } from "../../shared";
import { AdminErr } from "../AdminErr";
import { Fetch } from "../FetchUtils";
import { Ec2Control, Ec2State, Ec2Status } from "./Ec2Control";

export class Ec2Service implements Ec2Control {
  constructor(private token: RsOption<string>) {}

  private ec2StateSchema = z.object({
    status: z.nativeEnum(Ec2Status),
    ip: z.string().nullish(),
  });

  async turnEc2On(): Promise<RsResult<Ec2State, AdminErr>> {
    const body = {
      command: "ec2-control",
      data: {
        operation: "on",
      },
    };
    const res = await new Fetch().fetch(body, this.ec2StateSchema, this.token);
    return res.map((e) => ({
      status: e.status,
      ip: Opt(e.ip),
    }));
  }

  async ec2Status(): Promise<RsResult<Ec2State, AdminErr>> {
    const body = {
      command: "ec2-control",
      data: {
        operation: "status",
      },
    };
    const res = await new Fetch().fetch(body, this.ec2StateSchema, this.token);
    return res.map((e) => ({
      status: e.status,
      ip: Opt(e.ip),
    }));
  }

  async turnEc2Off(): Promise<RsResult<Ec2State, AdminErr>> {
    const body = {
      command: "ec2-control",
      data: {
        operation: "off",
      },
    };
    const res = await new Fetch().fetch(body, this.ec2StateSchema, this.token);
    return res.map((e) => ({
      status: e.status,
      ip: Opt(e.ip),
    }));
  }
}
