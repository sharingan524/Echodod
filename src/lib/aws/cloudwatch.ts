/**
 * AWS CloudWatch Client
 * Retrieves metrics for Connect, SES, and Pinpoint services.
 */

import {
  CloudWatchClient,
  GetMetricDataCommand,
  type MetricDataQuery,
} from "@aws-sdk/client-cloudwatch";
import type { AwsClientConfig } from "./credentials";

function createClient(config: AwsClientConfig): CloudWatchClient {
  return new CloudWatchClient({
    region: config.region,
    credentials: config.credentials,
  });
}

/** Generic metric data fetcher */
export async function getMetricData(
  config: AwsClientConfig,
  params: {
    queries: MetricDataQuery[];
    startTime: Date;
    endTime: Date;
  }
) {
  const client = createClient(config);
  const command = new GetMetricDataCommand({
    MetricDataQueries: params.queries,
    StartTime: params.startTime,
    EndTime: params.endTime,
  });

  const result = await client.send(command);
  return result.MetricDataResults || [];
}

/** Get Connect metrics: contacts handled, missed, avg queue time */
export async function getConnectMetrics(
  config: AwsClientConfig,
  params: {
    instanceId: string;
    startTime: Date;
    endTime: Date;
    period?: number;
  }
) {
  const period = params.period || 3600;

  const queries: MetricDataQuery[] = [
    {
      Id: "contacts_handled",
      MetricStat: {
        Metric: {
          Namespace: "AWS/Connect",
          MetricName: "ContactsHandled",
          Dimensions: [
            { Name: "InstanceId", Value: params.instanceId },
          ],
        },
        Period: period,
        Stat: "Sum",
      },
    },
    {
      Id: "contacts_missed",
      MetricStat: {
        Metric: {
          Namespace: "AWS/Connect",
          MetricName: "MissedContacts",
          Dimensions: [
            { Name: "InstanceId", Value: params.instanceId },
          ],
        },
        Period: period,
        Stat: "Sum",
      },
    },
    {
      Id: "avg_queue_time",
      MetricStat: {
        Metric: {
          Namespace: "AWS/Connect",
          MetricName: "QueueAnswerTime",
          Dimensions: [
            { Name: "InstanceId", Value: params.instanceId },
          ],
        },
        Period: period,
        Stat: "Average",
      },
    },
  ];

  return getMetricData(config, {
    queries,
    startTime: params.startTime,
    endTime: params.endTime,
  });
}

/** Get SES metrics: sends, bounces, complaints, delivery rate */
export async function getSesMetrics(
  config: AwsClientConfig,
  params: {
    startTime: Date;
    endTime: Date;
    period?: number;
  }
) {
  const period = params.period || 3600;

  const queries: MetricDataQuery[] = [
    {
      Id: "ses_sends",
      MetricStat: {
        Metric: { Namespace: "AWS/SES", MetricName: "Send" },
        Period: period,
        Stat: "Sum",
      },
    },
    {
      Id: "ses_deliveries",
      MetricStat: {
        Metric: { Namespace: "AWS/SES", MetricName: "Delivery" },
        Period: period,
        Stat: "Sum",
      },
    },
    {
      Id: "ses_bounces",
      MetricStat: {
        Metric: { Namespace: "AWS/SES", MetricName: "Bounce" },
        Period: period,
        Stat: "Sum",
      },
    },
    {
      Id: "ses_complaints",
      MetricStat: {
        Metric: { Namespace: "AWS/SES", MetricName: "Complaint" },
        Period: period,
        Stat: "Sum",
      },
    },
  ];

  return getMetricData(config, {
    queries,
    startTime: params.startTime,
    endTime: params.endTime,
  });
}

/** Get Pinpoint SMS delivery metrics */
export async function getPinpointMetrics(
  config: AwsClientConfig,
  params: {
    startTime: Date;
    endTime: Date;
    period?: number;
  }
) {
  const period = params.period || 3600;

  const queries: MetricDataQuery[] = [
    {
      Id: "sms_success",
      MetricStat: {
        Metric: {
          Namespace: "AWS/SMSVoice",
          MetricName: "TextMessageMonthlySpend",
        },
        Period: period,
        Stat: "Sum",
      },
    },
  ];

  return getMetricData(config, {
    queries,
    startTime: params.startTime,
    endTime: params.endTime,
  });
}
