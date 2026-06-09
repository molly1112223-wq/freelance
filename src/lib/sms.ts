import DysmsapiClient, { SendSmsRequest } from "@alicloud/dysmsapi20170525";
import { $OpenApiUtil } from "@alicloud/openapi-core";

type SendSmsCodeResult = {
  provider: "mock" | "aliyun";
  code?: string;
};

function createCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} 未配置。`);
  }
  return value;
}

export async function sendSmsCode(phone: string): Promise<SendSmsCodeResult> {
  const code = createCode();
  const provider = process.env.SMS_PROVIDER ?? "mock";

  if (provider !== "aliyun") {
    return { provider: "mock", code };
  }

  const client = new DysmsapiClient(new $OpenApiUtil.Config({
    accessKeyId: getRequiredEnv("ALIYUN_ACCESS_KEY_ID"),
    accessKeySecret: getRequiredEnv("ALIYUN_ACCESS_KEY_SECRET"),
    endpoint: "dysmsapi.aliyuncs.com"
  }));

  const response = await client.sendSms(
    new SendSmsRequest({
      phoneNumbers: phone,
      signName: getRequiredEnv("ALIYUN_SMS_SIGN_NAME"),
      templateCode: getRequiredEnv("ALIYUN_SMS_TEMPLATE_CODE"),
      templateParam: JSON.stringify({ code })
    })
  );

  if (response.body?.code !== "OK") {
    throw new Error(response.body?.message ?? "短信发送失败。");
  }

  return { provider: "aliyun", code };
}
