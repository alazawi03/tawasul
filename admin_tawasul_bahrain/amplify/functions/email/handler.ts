import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import type { APIGatewayProxyHandler } from "aws-lambda";
import { randomUUID } from "node:crypto";

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
});

interface EmailRequest {
  requestType: "consultation" | "suggestion" | "complaint";
  personName: string;
  adminLink?: string;
  formData: {
    email?: string;
    phone?: string;
    message?: string;
    category?: string;
    priority?: string;
    [key: string]: any;
  };
}

const formatEmailContent = (
  requestType: string,
  personName: string,
  formData: any
): string => {
  const baseContent = `
    <h2>طلب جديد من موقع تواصل البحرين</h2>
    <p><strong>نوع الطلب:</strong> ${requestType}</p>
    <p><strong>اسم المرسل:</strong> ${personName}</p>
  `;

  const formFields = Object.entries(formData)
    .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
    .join("");

  return baseContent + formFields;
};

const getEmailSubject = (requestType: string): string => {
  const subjects = {
    consultation: "طلب استشارة جديد - تواصل البحرين",
    suggestion: "اقتراح جديد - تواصل البحرين",
    complaint: "شكوى جديدة - تواصل البحرين",
  };

  return (
    subjects[requestType as keyof typeof subjects] || "طلب جديد - تواصل البحرين"
  );
};

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    if (!body) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Request body is required" }),
      };
    }

    const { requestType, personName, adminLink, formData }: EmailRequest = body;

    if (!requestType || !personName || !formData) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Missing required fields: requestType, personName, formData",
        }),
      };
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error("ADMIN_EMAIL environment variable is not set");
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    const emailContent = formatEmailContent(requestType, personName, formData);
    const subject = getEmailSubject(requestType);

    const emailCommand = new SendEmailCommand({
      Source: adminEmail,
      Destination: {
        ToAddresses: [adminEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: emailContent,
            Charset: "UTF-8",
          },
        },
      },
    });

    const result = await sesClient.send(emailCommand);
    console.log("Email sent successfully:", result.MessageId);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Email sent successfully",
        messageId: result.MessageId,
      }),
    };
  } catch (error) {
    console.error("Error sending email:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
