import axios from "axios";
import {EStatus} from "../types/EStatus";

export class RequestTester {
    static testRequest = async (url: string) => {
        const date = new Date();
        const startTime = Date.now();
        let status = EStatus.Error;
        let status_code = 0;
        let status_message = 'Unknown Error';

        try {
            const response = await axios.get(url);
            const response_time = Date.now() - startTime;
            status_code = response.status;
            status_message = response.statusText;

            if (status_code >= 200 && status_code < 300 && response_time < 1000) {
                status = EStatus.Success;
            } else if (status_code >= 200 && status_code < 500 && response_time > 1000) {
                status = EStatus.Warning;
            }
            else if (status_code >= 500 ) {
                status = EStatus.Error;
            }

            return {
                url,
                lastStatus: {
                    date,
                    status,
                    response_time,
                    status_code,
                    status_message,
                }
            };
        } catch (error) {
            const response_time = Date.now() - startTime;
            if (axios.isAxiosError(error)) {
                status_code = error.response?.status || 500;
                status_message = error.message;
            }

            return {
                url,
                lastStatus: {
                    date,
                    status,
                    response_time,
                    status_code,
                    status_message,
                }
            };
        }
    }
}


