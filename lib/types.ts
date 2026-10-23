export type CheckResult = {
  status: "up" | "down";
  statusCode: number | null;
  responseTime: number;
  checkedAt: string;
  error?: string;
};

export type Site = {
  id: string;
  url: string;
  lastCheck?: CheckResult;
};
