export type TestedUrl = {
  responseTime: number;
  status: EStatus;
  statusCode: number;
  statusMessage: string;
}

enum EStatus {
  Error = "Error",
  Warning = "Warning",
  Success = "Success"
}