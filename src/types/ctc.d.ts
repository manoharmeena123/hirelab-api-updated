import { WritableDraft } from "immer";

interface CTC {
  id: number;
  title: string;
  status: string;
  jobs_count: string | number;
  created_at: string;
  updated_at: string;
}

interface CTCResponse {
  code: number;
  success: boolean;
  message: string;
  data: CTC[];
}

type WritableCTCResponse = WritableDraft<CTCResponse>;
