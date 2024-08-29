import {UrlData} from "@/common/components/UrlCard/UrlCard.tsx";
import {Log} from "@/common/models/Log.ts";

export type UrlDataWithLogs = UrlData & { logs: Log[] };
