import crypto from "crypto";

const createMoMo = async (order) => {
  const partnerCode = "MOMO";
  const accessKey = "F8BBA842ECF85";
  const secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  const requestId = partnerCode + new Date().getTime();
  const orderId = order.course_registration_id;
  const orderInfo = "pay with MoMo";
  const redirectUrl = `${process.env.FRONTEND_URL}/complete-payment?orderId=${orderId}`;
  const ipnUrl = "";
  const extraData = "";
  const requestType = "payWithATM";
  const amount = order.giaca;

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
  //   console.log("====================================");
  //   console.log(rawSignature);
  //   console.log("====================================");

  const signature = crypto
    .createHmac("sha256", secretkey)
    .update(rawSignature)
    .digest("hex");
  //   console.log("====================================");
  //   console.log(signature);
  //   console.log("====================================");

  //json object send to MoMo endpoint
  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "vi",
  });
  //   console.log('====================================');
  //   console.log(requestBody);
  //   console.log('====================================');

  const response = await fetch(
    "https://test-payment.momo.vn/v2/gateway/api/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    }
  );

  const result = await response.json();

  // console.log("MoMo response:", result);
  //   console.log(result.errorCode);
  //   console.log(result.payUrl);

  if (result.resultCode !== 0) {
    throw new Error(`MoMo Error: ${result.localMessage || result.message}`);
  }

  return result.payUrl;
};

export default createMoMo;
